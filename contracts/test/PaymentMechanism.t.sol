// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";
import "../src/types/Struct.sol";

contract PaymentMechanismTest is Test {
    ProcurementV2 public procurement;
    address public owner;
    address public agency;
    address public contractor;
    address public tokenAddress;
    
    uint256 constant PROJECT_BUDGET = 1000e18;
    uint256 constant MILESTONE_AMOUNT = 500e18;
    
    function setUp() public {
        owner = address(this);
        agency = address(0x1111);
        contractor = address(0x2222);
        tokenAddress = address(0x4444);
        
        // Deploy contract
        procurement = new ProcurementV2(tokenAddress);
        
        // Grant roles
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.CONTRACTOR_ROLE(), contractor);
    }
    
    // ============ Escrow Tests ============
    
    function test_ProjectBudgetLockedInEscrow() public {
        // Mock token allowance and transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.allowance.selector),
            abi.encode(PROJECT_BUDGET)
        );
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transferFrom.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        // Check payment is locked in escrow
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(total, PROJECT_BUDGET);
        assertEq(paid, 0);
        assertEq(remaining, PROJECT_BUDGET);
    }
    
    function test_EscrowBalanceDecreasesOnPayment() public {
        // Setup project and milestone
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve milestone
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Release payment
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Check escrow balance decreased
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(paid, MILESTONE_AMOUNT);
        assertEq(remaining, PROJECT_BUDGET - MILESTONE_AMOUNT);
    }
    
    // ============ Payment Release Tests ============
    
    function test_ReleaseFullMilestonePayment() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Mock token transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Release payment
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Verify payment was released
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(paid, MILESTONE_AMOUNT);
    }
    
    function test_CannotReleaseUnapprovedMilestone() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Try to release without approval
        vm.prank(agency);
        vm.expectRevert("Milestone not approved");
        procurement.releaseMilestonePayment(milestoneId);
    }
    
    function test_CannotReleaseWithInsufficientEscrow() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Create second milestone with remaining budget
        vm.prank(agency);
        uint256 milestoneId2 = procurement.createMilestone(
            projectId,
            "Milestone 2",
            PROJECT_BUDGET,
            block.timestamp + 20 days
        );
        
        // Approve both
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash1");
        procurement.submitMilestone(milestoneId2, "QmHash2");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        procurement.approveMilestone(milestoneId2);
        
        // Mock transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Release first payment
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Try to release second (insufficient funds)
        vm.prank(agency);
        vm.expectRevert("Insufficient funds in escrow");
        procurement.releaseMilestonePayment(milestoneId2);
    }
    
    // ============ Partial Payment Tests ============
    
    function test_ReleasePartialPayment() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Mock transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Release partial payment
        uint256 partialAmount = MILESTONE_AMOUNT / 2;
        vm.prank(agency);
        procurement.releasePartialPayment(milestoneId, partialAmount);
        
        // Verify partial payment
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(paid, partialAmount);
        assertEq(remaining, PROJECT_BUDGET - partialAmount);
    }
    
    function test_CannotReleasePartialPaymentMoreThanMilestone() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Try to release more than milestone amount
        vm.prank(agency);
        vm.expectRevert("Invalid amount");
        procurement.releasePartialPayment(milestoneId, MILESTONE_AMOUNT + 1);
    }
    
    // ============ Refund Tests ============
    
    function test_RefundEscrowOnCancelledProject() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Mock transfer for refund
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Refund escrow
        vm.prank(agency);
        procurement.refundEscrow(projectId);
        
        // Verify refund
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(remaining, 0);
    }
    
    function test_CannotRefundCompletedProject() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Complete project
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Try to refund completed project
        vm.prank(agency);
        vm.expectRevert("Cannot refund completed project");
        procurement.refundEscrow(projectId);
    }
    
    function test_CannotRefundWithNoFunds() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Release all funds
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Try to refund with no remaining funds
        vm.prank(agency);
        vm.expectRevert("No funds to refund");
        procurement.refundEscrow(projectId);
    }
    
    // ============ Payment History Tests ============
    
    function test_GetPaymentHistory() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Mock transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Release payment
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Get history
        (uint256 total, uint256 paid, uint256 remaining, uint256 releaseTime) = 
            procurement.getPaymentHistory(projectId);
        
        assertEq(total, PROJECT_BUDGET);
        assertEq(paid, MILESTONE_AMOUNT);
        assertEq(remaining, PROJECT_BUDGET - MILESTONE_AMOUNT);
        assertGt(releaseTime, 0);
    }
    
    function test_GetMilestonePaymentDetails() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        (uint256 amount, uint256 dueDate, uint8 status, uint256 submittedAt, uint256 approvedAt) = 
            procurement.getMilestonePaymentDetails(milestoneId);
        
        assertEq(amount, MILESTONE_AMOUNT);
        assertGt(dueDate, block.timestamp);
        assertEq(status, 0); // PENDING
        assertEq(submittedAt, 0);
        assertEq(approvedAt, 0);
    }
    
    // ============ Project Completion Tests ============
    
    function test_ProjectCompletesWhenAllPaymentsReleased() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Submit and approve
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        // Mock transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Release payment
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Verify project completed
        (uint256 total, uint256 paid, uint256 remaining, ) = procurement.getPaymentHistory(projectId);
        assertEq(remaining, 0);
    }
    
    function test_ReputationUpdatedOnCompletion() public {
        (uint256 projectId, uint256 milestoneId) = _createProjectAndMilestone();
        
        // Get initial reputation
        ContractorReputation memory repBefore = procurement.getContractorReputation(contractor);
        
        // Complete project
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash123");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
        
        // Get updated reputation
        ContractorReputation memory repAfter = procurement.getContractorReputation(contractor);
        
        assertEq(repAfter.completedProjects, repBefore.completedProjects + 1);
    }
    
    // ============ Helper Functions ============
    
    function _createProjectAndMilestone() internal returns (uint256, uint256) {
        // Mock token calls
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.allowance.selector),
            abi.encode(PROJECT_BUDGET)
        );
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transferFrom.selector),
            abi.encode(true)
        );
        
        // Create project
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        // Create milestone
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Test Milestone",
            MILESTONE_AMOUNT,
            block.timestamp + 15 days
        );
        
        return (projectId, milestoneId);
    }
}
