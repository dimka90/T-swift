// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "./MockERC20.sol";
import "../src/core/Contractor.sol";

contract ContractorTest is Test {
    Procurement public procurement;
    MockERC20 public token;

    address public agency = address(0x1);
    address public contractorAddress = address(0x2);

    function setUp() public {
        // Deploy mock ERC20 first
        token = new MockERC20();

        // Deploy Procurement with token address
        procurement = new Procurement(address(token));

        // Mint tokens to agency
        token.mint(agency, 1000 ether);

        // Agency approves
        vm.prank(agency);
        token.approve(address(procurement), 1000 ether);
    }

    function testCreateProject() public {
        uint256 budget = 500 ether;
        string memory description = "Test Project";
        uint startDate = block.timestamp;
        uint endDate = block.timestamp + 30 days;

        vm.prank(agency);
        procurement.createProject(
            description,
            budget,
            contractorAddress,
            startDate,
            endDate
        );

        (uint256 projectId, string memory desc, uint256 projBudget, address contAddr, , , , ) = procurement.projects(1);

        assertEq(projectId, 1);
        assertEq(desc, description);
        assertEq(projBudget, budget);
        assertEq(contAddr, contractorAddress);
    }
}
