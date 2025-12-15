// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";

// Mock ERC20 token for testing
contract MockToken {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        // Mint tokens to test addresses
        balanceOf[msg.sender] = 1000000 * 10**18;
    }
    
    function totalSupply() external view returns (uint256) {
        return 1000000 * 10**18;
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
}

contract ProcurementV2Test is Test {
    ProcurementV2 public procurement;
    MockToken public token;
    
    address public agency = address(0x1);
    address public contractor = address(0x2);
    address public other = address(0x3);
    
    uint256 public constant BUDGET = 1000 * 10**18;
    uint256 public constant MILESTONE_AMOUNT = 250 * 10**18;
    
    function setUp() public {
        // Deploy token
        token = new MockToken();
        
        // Deploy procurement contract
        procurement = new ProcurementV2(address(token));
        
        // Distribute tokens
        token.transfer(agency, BUDGET * 10);
        token.transfer(contractor, BUDGET);
        
        // Approve spending
        vm.prank(agency);
        token.approve(address(procurement), BUDGET * 10);
        
        vm.prank(contractor);
        token.approve(address(procurement), BUDGET);
    }
    
    // ============ Project Creation Tests ============
    
    function test_CreateProject_Success() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        assertEq(projectId, 1);
    }
    
    function test_CreateProject_InvalidBudget() public {
        vm.prank(agency);
        vm.expectRevert("Budget must be greater than 0");
        procurement.createProject(
            "Test Project",
            0,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CreateProject_InvalidContractor() public {
        vm.prank(agency);
        vm.expectRevert("Invalid contractor address");
        procurement.createProject(
            "Test Project",
            BUDGET,
            address(0),
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CreateProject_InvalidDates() public {
        vm.prank(agency);
        vm.expectRevert("End date must be after start date");
        procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp + 30 days,
            block.timestamp
        );
    }
    
    function test_CreateProject_InsufficientAllowance() public {
        vm.prank(other);
        token.transfer(agency, BUDGET);
        
        vm.prank(agency);
        vm.expectRevert("Insufficient allowance");
        procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CreateProject_TransfersTokens() public {
        uint256 balanceBefore = token.balanceOf(agency);
        
        vm.prank(agency);
        procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        uint256 balanceAfter = token.balanceOf(agency);
        assertEq(balanceBefore - balanceAfter, BUDGET);
    }
    
    // ============ Milestone Creation Tests ============
    
    function test_CreateMilestone_Success() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp + 7 days
        );
        
        assertEq(milestoneId, 1);
    }
    
    function test_CreateMilestone_OnlyAgency() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(contractor);
        vm.expectRevert("Only project agency can call this");
        procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp + 7 days
        );
    }
    
    function test_CreateMilestone_InvalidAmount() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        vm.expectRevert("Amount must be greater than 0");
        procurement.createMilestone(
            projectId,
            "Milestone 1",
            0,
            block.timestamp + 7 days
        );
    }
    
    function test_CreateMilestone_InvalidDueDate() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        vm.expectRevert("Due date must be in the future");
        procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp - 1 days
        );
    }
    
    function test_CreateMilestone_ExceedsBudget() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        vm.expectRevert("Amount exceeds remaining budget");
        procurement.createMilestone(
            projectId,
            "Milestone 1",
            BUDGET + 1,
            block.timestamp + 7 days
        );
    }
    
    // ============ Milestone Submission Tests ============
    
    function test_SubmitMilestone_Success() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
    }
    
    function test_SubmitMilestone_OnlyContractor() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(other);
        vm.expectRevert("Only contractor can submit");
        procurement.submitMilestone(milestoneId, "QmHash123");
    }
    
    function test_SubmitMilestone_EmptyCid() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        vm.expectRevert("Deliverables CID cannot be empty");
        procurement.submitMilestone(milestoneId, "");
    }
    
    // ============ Milestone Approval Tests ============
    
    function test_ApproveMilestone_Success() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
    }
    
    function test_ApproveMilestone_OnlyAgency() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(other);
        vm.expectRevert("Only agency can approve");
        procurement.approveMilestone(milestoneId);
    }
    
    function test_ApproveMilestone_NotSubmitted() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(agency);
        vm.expectRevert("Milestone not submitted");
        procurement.approveMilestone(milestoneId);
    }
    
    // ============ Milestone Rejection Tests ============
    
    function test_RejectMilestone_Success() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.rejectMilestone(milestoneId, "Quality not met");
    }
    
    function test_RejectMilestone_OnlyAgency() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(other);
        vm.expectRevert("Only agency can reject");
        procurement.rejectMilestone(milestoneId, "Quality not met");
    }
    
    // ============ Payment Release Tests ============
    
    function test_ReleaseMilestonePayment_Success() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        uint256 contractorBalanceBefore = token.balanceOf(contractor);
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        uint256 contractorBalanceAfter = token.balanceOf(contractor);
        assertEq(contractorBalanceAfter - contractorBalanceBefore, MILESTONE_AMOUNT);
    }
    
    function test_ReleaseMilestonePayment_OnlyAgency() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.prank(other);
        vm.expectRevert("Only agency can release payment");
        procurement.releaseMilestonePayment(milestoneId);
    }
    
    function test_ReleaseMilestonePayment_NotApproved() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        vm.prank(agency);
        vm.expectRevert("Milestone not approved");
        procurement.releaseMilestonePayment(milestoneId);
    }
    
    // ============ Full Workflow Tests ============
    
    function test_FullWorkflow_SingleMilestone() public {
        // Create project
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        // Create milestone
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp + 7 days
        );
        
        // Submit milestone
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        // Approve milestone
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Release payment
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Verify payment
        uint256 contractorBalance = token.balanceOf(contractor);
        assertGt(contractorBalance, 0);
    }
    
    function test_FullWorkflow_MultipleMilestones() public {
        // Create project
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        // Create 4 milestones
        uint256[] memory milestoneIds = new uint256[](4);
        for (uint i = 0; i < 4; i++) {
            vm.prank(agency);
            milestoneIds[i] = procurement.createMilestone(
                projectId,
                string(abi.encodePacked("Milestone ", vm.toString(i + 1))),
                MILESTONE_AMOUNT,
                block.timestamp + (i + 1) * 7 days
            );
        }
        
        // Submit, approve, and pay all milestones
        for (uint i = 0; i < 4; i++) {
            vm.prank(contractor);
            procurement.submitMilestone(milestoneIds[i], "QmHash123");
            
            vm.prank(agency);
            procurement.approveMilestone(milestoneIds[i]);
            
            vm.prank(agency);
            procurement.releaseMilestonePayment(milestoneIds[i]);
        }
        
        // Verify all payments released
        uint256 contractorBalance = token.balanceOf(contractor);
        assertEq(contractorBalance, BUDGET);
    }
    
    function test_FullWorkflow_RejectionAndResubmission() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit milestone
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        // Reject milestone
        vm.prank(agency);
        procurement.rejectMilestone(milestoneId, "Quality not met");
        
        // Verify contractor can resubmit
        // Note: In current implementation, resubmission would need additional logic
    }
    
    // ============ Reputation System Tests ============
    
    function test_RateContractor_Success() public {
        uint256 projectId = _createAndCompleteProject();
        
        vm.prank(agency);
        procurement.rateContractor(contractor, projectId, 5, "Excellent work!");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.ratingCount, 1);
        assertEq(rep.totalRating, 5);
        assertEq(rep.averageRating, 500);
    }
    
    function test_RateContractor_MultipleRatings() public {
        uint256 projectId1 = _createAndCompleteProject();
        
        vm.prank(agency);
        procurement.rateContractor(contractor, projectId1, 5, "Great!");
        
        uint256 projectId2 = _createAndCompleteProject();
        
        vm.prank(agency);
        procurement.rateContractor(contractor, projectId2, 4, "Good work");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.ratingCount, 2);
        assertEq(rep.totalRating, 9);
        assertEq(rep.averageRating, 450);
    }
    
    function test_RateContractor_InvalidScore() public {
        uint256 projectId = _createAndCompleteProject();
        
        vm.prank(agency);
        vm.expectRevert("Score must be between 1 and 5");
        procurement.rateContractor(contractor, projectId, 0, "Invalid");
        
        vm.prank(agency);
        vm.expectRevert("Score must be between 1 and 5");
        procurement.rateContractor(contractor, projectId, 6, "Invalid");
    }
    
    function test_RateContractor_OnlyAgency() public {
        uint256 projectId = _createAndCompleteProject();
        
        vm.prank(contractor);
        vm.expectRevert("Only project agency can rate");
        procurement.rateContractor(contractor, projectId, 5, "Test");
    }
    
    function test_RateContractor_ProjectNotCompleted() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        vm.expectRevert("Project must be completed");
        procurement.rateContractor(contractor, projectId, 5, "Test");
    }
    
    function test_RateAgency_Success() public {
        uint256 projectId = _createAndCompleteProject();
        
        vm.prank(contractor);
        procurement.rateAgency(agency, projectId, 5, "Great agency!");
        
        AgencyReputation memory rep = procurement.getAgencyReputation(agency);
        assertEq(rep.ratingCount, 1);
        assertEq(rep.totalRating, 5);
        assertEq(rep.averageRating, 500);
    }
    
    function test_RateAgency_MultipleRatings() public {
        uint256 projectId1 = _createAndCompleteProject();
        
        vm.prank(contractor);
        procurement.rateAgency(agency, projectId1, 5, "Great!");
        
        uint256 projectId2 = _createAndCompleteProject();
        
        vm.prank(contractor);
        procurement.rateAgency(agency, projectId2, 4, "Good");
        
        AgencyReputation memory rep = procurement.getAgencyReputation(agency);
        assertEq(rep.ratingCount, 2);
        assertEq(rep.averageRating, 450);
    }
    
    function test_VerifyContractor_Success() public {
        vm.prank(address(this));
        procurement.verifyContractor(contractor);
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertTrue(rep.isVerified);
    }
    
    function test_VerifyContractor_OnlyOwner() public {
        vm.prank(agency);
        vm.expectRevert("Only owner can call this");
        procurement.verifyContractor(contractor);
    }
    
    function test_VerifyAgency_Success() public {
        vm.prank(address(this));
        procurement.verifyAgency(agency, 2);
        
        AgencyReputation memory rep = procurement.getAgencyReputation(agency);
        assertTrue(rep.isVerified);
        assertEq(rep.verificationLevel, 2);
    }
    
    function test_VerifyAgency_InvalidLevel() public {
        vm.prank(address(this));
        vm.expectRevert("Invalid verification level");
        procurement.verifyAgency(agency, 0);
        
        vm.prank(address(this));
        vm.expectRevert("Invalid verification level");
        procurement.verifyAgency(agency, 4);
    }
    
    function test_ApplyPenalty_Success() public {
        vm.prank(address(this));
        procurement.applyPenalty(contractor, 10, "Late delivery");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.penaltyPoints, 10);
    }
    
    function test_ApplyPenalty_Multiple() public {
        vm.prank(address(this));
        procurement.applyPenalty(contractor, 10, "Late delivery");
        
        vm.prank(address(this));
        procurement.applyPenalty(contractor, 5, "Poor quality");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.penaltyPoints, 15);
    }
    
    function test_GetProjectRatings() public {
        uint256 projectId = _createAndCompleteProject();
        
        vm.prank(agency);
        procurement.rateContractor(contractor, projectId, 5, "Excellent!");
        
        vm.prank(contractor);
        procurement.rateAgency(agency, projectId, 4, "Good!");
        
        Rating[] memory ratings = procurement.getProjectRatings(projectId);
        assertEq(ratings.length, 2);
        assertEq(ratings[0].score, 5);
        assertEq(ratings[1].score, 4);
    }
    
    function test_ReputationInitialization() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        ContractorReputation memory contractorRep = procurement.getContractorReputation(contractor);
        assertEq(contractorRep.totalProjects, 1);
        assertEq(contractorRep.completedProjects, 0);
        
        AgencyReputation memory agencyRep = procurement.getAgencyReputation(agency);
        assertEq(agencyRep.totalProjects, 1);
        assertEq(agencyRep.completedProjects, 0);
    }
    
    function test_ReputationUpdateOnCompletion() public {
        _createAndCompleteProject();
        
        ContractorReputation memory contractorRep = procurement.getContractorReputation(contractor);
        assertEq(contractorRep.completedProjects, 1);
        assertEq(contractorRep.totalProjects, 1);
        
        AgencyReputation memory agencyRep = procurement.getAgencyReputation(agency);
        assertEq(agencyRep.completedProjects, 1);
        assertEq(agencyRep.totalProjects, 1);
    }
    
    function test_ReputationTrackRejectedMilestones() public {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp + 10 days
        );
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmTest");
        
        vm.prank(agency);
        procurement.rejectMilestone(milestoneId, "Not acceptable");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.rejectedMilestones, 1);
    }
    
    // ============ Helper Functions ============
    
    function _createProjectAndMilestone() internal returns (uint256, uint256) {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Milestone 1",
            MILESTONE_AMOUNT,
            block.timestamp + 7 days
        );
        
        return (projectId, milestoneId);
    }
    
    function _createAndCompleteProject() internal returns (uint256) {
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Milestone 1",
            BUDGET,  // Use full budget for single milestone
            block.timestamp + 10 days
        );
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmTest");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        return projectId;
    }
}
