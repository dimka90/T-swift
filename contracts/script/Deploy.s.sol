// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/core/Contractor.sol";

contract DeployProcurement is Script {
    function run() external {
        // Celo Mainnet Token Address
        address tokenAddress = 0x0A2f0027125f75B8f5F155f2C158C5A4e26B913A;
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the Procurement contract
        Procurement procurement = new Procurement(tokenAddress);
        
        vm.stopBroadcast();
        
        // Log the deployment address
        console.log("Procurement contract deployed at:", address(procurement));
        console.log("Token address:", tokenAddress);
    }
}
