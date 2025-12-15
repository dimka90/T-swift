// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";
import "../src/types/Struct.sol";

contract AccessControlTest is Test {
    ProcurementV2 public procurement;
    address public owner;
    address public agency;
    address public contractor;
    address public arbitrator;
    address public tokenAddress;
    
    function setUp() public {
        owner = address(this);
        agency = address(0x1111);
        contractor = address(0x2222);
        arbitrator = address(0x3333);
        tokenAddress = address(0x4444);
        
        // Deploy contract
        procurement = new ProcurementV2(tokenAddress);
    }
    
    // ============ Role Management Tests ============
    
    function test_OwnerHasAdminRole() public {
        assertTrue(procurement.hasRole(procurement.ADMIN_ROLE(), owner));
    }
    
    function test_GrantAgencyRole() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        assertTrue(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
    }
    
    function test_GrantContractorRole() public {
        procurement.grantRole(procurement.CONTRACTOR_ROLE(), contractor);
        assertTrue(procurement.hasRole(procurement.CONTRACTOR_ROLE(), contractor));
    }
    
    function test_GrantArbitratorRole() public {
        procurement.grantRole(procurement.ARBITRATOR_ROLE(), arbitrator);
        assertTrue(procurement.hasRole(procurement.ARBITRATOR_ROLE(), arbitrator));
    }
    
    function test_RevokeRole() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        assertTrue(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
        
        procurement.revokeRole(procurement.AGENCY_ROLE(), agency);
        assertFalse(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
    }
    
    function test_GetRoleMembers() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.AGENCY_ROLE(), address(0x5555));
        
        address[] memory members = procurement.getRoleMembers(procurement.AGENCY_ROLE());
        assertEq(members.length, 2);
    }
    
    // ============ Access Control Tests ============
    

    
    function test_NonAgencyCannotCreateProject() public {
        vm.prank(contractor);
        vm.expectRevert("Only agency can call this");
        procurement.createProject("Test", 1000, contractor, block.timestamp, block.timestamp + 1 days);
    }
    
    function test_AgencyCanCreateProject() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        
        // Mock token transfer
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.allowance.selector),
            abi.encode(1000)
        );
        vm.mockCall(
            tokenAddress,
            abi.encodeWithSelector(ITOKEN.transferFrom.selector),
            abi.encode(true)
        );
        
        vm.prank(agency);
        uint256 projectId = procurement.createProject(
            "Test Project",
            1000,
            contractor,
            block.timestamp,
            block.timestamp + 1 days
        );
        
        assertEq(projectId, 1);
    }
    
    // ============ Role Verification Tests ============
    
    function test_VerifyContractorOnlyAdmin() public {
        vm.prank(agency);
        vm.expectRevert("Only admin can call this");
        procurement.verifyContractor(contractor);
    }
    
    function test_AdminCanVerifyContractor() public {
        procurement.verifyContractor(contractor);
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertTrue(rep.isVerified);
    }
    
    function test_VerifyAgencyOnlyAdmin() public {
        vm.prank(contractor);
        vm.expectRevert("Only admin can call this");
        procurement.verifyAgency(agency, 1);
    }
    
    function test_AdminCanVerifyAgency() public {
        procurement.verifyAgency(agency, 2);
        
        AgencyReputation memory rep = procurement.getAgencyReputation(agency);
        assertTrue(rep.isVerified);
        assertEq(rep.verificationLevel, 2);
    }
    
    // ============ Penalty Tests ============
    
    function test_ApplyPenaltyOnlyAdmin() public {
        vm.prank(contractor);
        vm.expectRevert("Only admin can call this");
        procurement.applyPenalty(contractor, 10, "Test penalty");
    }
    
    function test_AdminCanApplyPenalty() public {
        procurement.applyPenalty(contractor, 10, "Test penalty");
        
        ContractorReputation memory rep = procurement.getContractorReputation(contractor);
        assertEq(rep.penaltyPoints, 10);
    }
    
    // ============ Multiple Roles Tests ============
    
    function test_AddressCanHaveMultipleRoles() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.ARBITRATOR_ROLE(), agency);
        
        assertTrue(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
        assertTrue(procurement.hasRole(procurement.ARBITRATOR_ROLE(), agency));
    }
    
    function test_RevokeOneRoleKeepsOthers() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.ARBITRATOR_ROLE(), agency);
        
        procurement.revokeRole(procurement.AGENCY_ROLE(), agency);
        
        assertFalse(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
        assertTrue(procurement.hasRole(procurement.ARBITRATOR_ROLE(), agency));
    }
    
    // ============ Edge Cases ============
    
    function test_GrantingSameRoleMultipleTimes() public {
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        procurement.grantRole(procurement.AGENCY_ROLE(), agency);
        
        address[] memory members = procurement.getRoleMembers(procurement.AGENCY_ROLE());
        // Should only appear once
        uint256 count = 0;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == agency) count++;
        }
        assertEq(count, 1);
    }
    
    function test_RevokingNonExistentRole() public {
        // Should not revert, just no-op
        procurement.revokeRole(procurement.AGENCY_ROLE(), agency);
        assertFalse(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
    }
}
