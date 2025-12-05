// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/Contractor.sol";
import "../src/interfaces/ITOKEN.sol";

contract InteractProcurement is Script {
    Procurement procurement;
    ITOKEN token;
    // address contractAddress = 0x34a99057232cc4a7eB21398fD0052474f4B5Bcc5;
    address contractAddress = 0x0Cb14143e45130996961814f4A2f3Cf17586F484;
    address tokenAddress;
    address contractor1 = 0x1111111111111111111111111111111111111111;
    address contractor2 = 0x2222222222222222222222222222222222222222;

    function setUp() public {
        procurement = Procurement(contractAddress);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Batch 1: Create 10 contractors (no token needed)
        for (uint i = 1; i <= 10; i++) {
            try procurement.createContractor(
                string(abi.encodePacked("Company ", vm.toString(i))),
                10000 + i,
                20000 + i,
                string(abi.encodePacked("Address ", vm.toString(i))),
                "QmHash1",
                "QmHash2"
            ) {} catch {}
        }

        // Batch 2: Submit 10 projects (read-only, cheap)
        for (uint i = 1; i <= 10; i++) {
            try procurement.SubmitProject(
                i,
                string(abi.encodePacked("Submitted ", vm.toString(i))),
                "QmHash"
            ) {} catch {}
        }

        vm.stopBroadcast();
    }
}
