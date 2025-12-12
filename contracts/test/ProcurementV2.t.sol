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
}
