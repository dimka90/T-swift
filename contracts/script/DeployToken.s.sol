// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/tokens/TswiftToken.sol";

contract DeployToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the TswiftToken contract
        TswiftToken token = new TswiftToken();
        
        vm.stopBroadcast();
        
        // Log the deployment address
        console.log("TswiftToken deployed at:", address(token));
        console.log("Initial supply: 1,000,000 TSWIFT");
        console.log("Deployer address:", msg.sender);
    }
}
