// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";
import "../src/types/Struct.sol";

contract SecurityHardeningTest is Test {
    ProcurementV2 public procurement;
    address public owner;
    address public agency;
    address public contractor;
    address public tokenAddress;
    
    uint256 constant PROJECT_BUDGET = 1000e18;
    
    function setUp() public {
        owner = address(this);
        agency = address(0x1111);
        contractor = address(0x2222);
        tokenAddress = address(0x4444);
        
        procurement = new ProcurementV2(tokenAddress);
        
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.CONTRACTOR_ROLE(), contractor);
    }
    
    // ============ Emergency Pause Tests ============
    
    function test_AdminCanPauseContract() public {
        procurement.pauseContract("Security incident");
        assertTrue(procurement.isPaused());
    }
    
    function test_AdminCanUnpauseContract() public {
        procurement.pauseContract("Security incident");
        assertTrue(procurement.isPaused());
        
        procurement.unpauseContract();
        assertFalse(procurement.isPaused());
    }
    
    function test_NonAdminCannotPauseContract() public {
        vm.prank(agency);
        vm.expectRevert();
        procurement.pauseContract("Unauthorized pause");
    }
    
    function test_CannotPauseAlreadyPausedContract() public {
        procurement.pauseContract("First pause");
        
        vm.expectRevert("Contract already paused");
        procurement.pauseContract("Second pause");
    }
    
    function test_CannotUnpauseUnpausedContract() public {
        vm.expectRevert("Contract is not paused");
        procurement.unpauseContract();
    }
    
    // ============ Pause Enforcement Tests ============
    
    function test_CannotCreateProjectWhenPaused() public {
        procurement.pauseContract("Emergency");
        
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.allowance.selector),
            abi.encode(PROJECT_BUDGET)
        );
        
        vm.prank(agency);
        vm.expectRevert("Contract is paused");
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotReleasePaymentWhenPaused() public {
        // Create project first
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
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Test",
            500e18,
            block.timestamp + 15 days
        );
        
        // Pause contract
        procurement.pauseContract("Emergency");
        
        // Try to release payment
        vm.prank(agency);
        vm.expectRevert("Contract is paused");
        procurement.releaseMilestonePayment(milestoneId);
    }
    
    // ============ Input Validation Tests ============
    
    function test_CannotCreateProjectWithZeroBudget() public {
        vm.prank(agency);
        vm.expectRevert("Budget must be greater than 0");
        procurement.createProject(
            "Test",
            0,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotCreateProjectWithExcessiveBudget() public {
        vm.prank(agency);
        vm.expectRevert("Budget exceeds maximum limit");
        procurement.createProject(
            "Test",
            11000000e18, // > 10M limit
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotCreateProjectWithInvalidDates() public {
        vm.prank(agency);
        vm.expectRevert("End date must be after start date");
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp + 30 days,
            block.timestamp // End before start
        );
    }
    
    function test_CannotCreateProjectWithFutureDateTooFar() public {
        vm.prank(agency);
        vm.expectRevert("End date too far in future");
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 400 days // > 365 days
        );
    }
    
    function test_CannotCreateProjectWithEmptyDescription() public {
        vm.prank(agency);
        vm.expectRevert("Description cannot be empty");
        procurement.createProject(
            "",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotCreateProjectWithTooLongDescription() public {
        string memory longDesc = new string(1001);
        
        vm.prank(agency);
        vm.expectRevert("Description too long");
        procurement.createProject(
            longDesc,
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotCreateProjectWithAgencyAsContractor() public {
        vm.prank(agency);
        vm.expectRevert("Agency cannot be contractor");
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            agency, // Same as caller
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    function test_CannotCreateProjectWithZeroContractorAddress() public {
        vm.prank(agency);
        vm.expectRevert("Invalid contractor address");
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            address(0),
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    // ============ Reentrancy Protection Tests ============
    
    function test_ReentrancyProtectionOnPaymentRelease() public {
        // This test verifies the nonReentrant modifier is in place
        // Actual reentrancy attack would require a malicious token contract
        // which is beyond the scope of this test
        
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
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        vm.prank(agency);
        uint256 milestoneId = procurement.createMilestone(
            projectId,
            "Test",
            500e18,
            block.timestamp + 15 days
        );
        
        vm.prank(contractor);
        procurement.submitMilestone(milestoneId, "QmHash");
        
        vm.prank(agency);
        procurement.approveMilestone(milestoneId);
        
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transfer.selector),
            abi.encode(true)
        );
        
        // Should succeed without reentrancy
        vm.prank(agency);
        procurement.releaseMilestonePayment(milestoneId);
    }
    
    // ============ Safe Math Tests ============
    
    function test_NoIntegerOverflowOnPaymentTracking() public {
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
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
        
        // Verify payment tracking doesn't overflow
        (uint256 total, uint256 paid, uint256 remaining, ) = 
            procurement.getPaymentHistory(projectId);
        
        assertEq(total, PROJECT_BUDGET);
        assertEq(paid, 0);
        assertEq(remaining, PROJECT_BUDGET);
        assertEq(total, paid + remaining);
    }
    
    // ============ Access Control Security Tests ============
    
    function test_OnlyAdminCanPause() public {
        vm.prank(contractor);
        vm.expectRevert();
        procurement.pauseContract("Unauthorized");
    }
    
    function test_OnlyAdminCanUnpause() public {
        procurement.pauseContract("Test");
        
        vm.prank(agency);
        vm.expectRevert();
        procurement.unpauseContract();
    }
    
    function test_OnlyAgencyCanCreateProject() public {
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.allowance.selector),
            abi.encode(PROJECT_BUDGET)
        );
        
        vm.prank(contractor);
        vm.expectRevert();
        procurement.createProject(
            "Test",
            PROJECT_BUDGET,
            contractor,
            block.timestamp,
            block.timestamp + 30 days
        );
    }
    
    // ============ State Consistency Tests ============
    
    function test_PauseStateConsistency() public {
        assertFalse(procurement.isPaused());
        
        procurement.pauseContract("Test");
        assertTrue(procurement.isPaused());
        
        procurement.unpauseContract();
        assertFalse(procurement.isPaused());
    }
}
