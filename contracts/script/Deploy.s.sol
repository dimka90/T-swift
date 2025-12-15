// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProcurementV2.sol";

contract DeployProcurement is Script {
    function run() external {
        // Celo Mainnet Token Address (cUSD)
        address tokenAddress = 0x765dE816845861e75a25FCA122BB6Caa78443cB5;
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the ProcurementV2 contract with reputation system
        ProcurementV2 procurement = new ProcurementV2(tokenAddress);
        
        vm.stopBroadcast();
        
        // Log the deployment address
        console.log("ProcurementV2 contract deployed at:", address(procurement));
        console.log("Token address:", tokenAddress);
    }
}
