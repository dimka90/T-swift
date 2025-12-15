// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";

contract InteractProcurement is Script {
    ProcurementV2 procurement;
    ITOKEN token;
    
    // Update with deployed contract address
    address contractAddress = 0x0Cb14143e45130996961814f4A2f3Cf17586F484;
    address tokenAddress = 0x765dE816845861e75a25FCA122BB6Caa78443cB5; // cUSD on Celo
    
    address agency = 0x1111111111111111111111111111111111111111;
    address contractor1 = 0x2222222222222222222222222222222222222222;
    address contractor2 = 0x3333333333333333333333333333333333333333;

    function setUp() public {
        procurement = ProcurementV2(contractAddress);
        token = ITOKEN(tokenAddress);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Example 1: Create a project
        console.log("Creating project...");
        try procurement.createProject(
            "Website Development",
            1000e18,  // 1000 cUSD
            contractor1,
            block.timestamp,
            block.timestamp + 30 days
        ) returns (uint256 projectId) {
            console.log("Project created with ID:", projectId);
            
            // Example 2: Create a milestone
            console.log("Creating milestone...");
            try procurement.createMilestone(
                projectId,
                "Frontend Development",
                500e18,  // 500 cUSD
                block.timestamp + 14 days
            ) returns (uint256 milestoneId) {
                console.log("Milestone created with ID:", milestoneId);
                
                // Example 3: Submit milestone
                console.log("Submitting milestone...");
                try procurement.submitMilestone(
                    milestoneId,
                    "QmHash123456789"
                ) {
                    console.log("Milestone submitted");
                } catch Error(string memory reason) {
                    console.log("Submit failed:", reason);
                }
            } catch Error(string memory reason) {
                console.log("Milestone creation failed:", reason);
            }
        } catch Error(string memory reason) {
            console.log("Project creation failed:", reason);
        }

        // Example 4: Verify contractor
        console.log("Verifying contractor...");
        try procurement.verifyContractor(contractor1) {
            console.log("Contractor verified");
        } catch Error(string memory reason) {
            console.log("Verification failed:", reason);
        }

        // Example 5: Get contractor reputation
        console.log("Getting contractor reputation...");
        ContractorReputation memory rep = procurement.getContractorReputation(contractor1);
        console.log("Total projects:", rep.totalProjects);
        console.log("Completed projects:", rep.completedProjects);
        console.log("Average rating:", rep.averageRating);
        console.log("Is verified:", rep.isVerified);

        vm.stopBroadcast();
    }

    // Helper function to demonstrate rating
    function demonstrateRating() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Rate a contractor (only works after project completion)
        try procurement.rateContractor(
            contractor1,
            1,  // projectId
            5,  // 5-star rating
            "Excellent work!"
        ) {
            console.log("Contractor rated successfully");
        } catch Error(string memory reason) {
            console.log("Rating failed:", reason);
        }

        vm.stopBroadcast();
    }

    // Helper function to demonstrate penalty
    function demonstratePenalty() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Apply penalty (admin only)
        try procurement.applyPenalty(
            contractor1,
            10,  // penalty points
            "Late delivery"
        ) {
            console.log("Penalty applied successfully");
        } catch Error(string memory reason) {
            console.log("Penalty failed:", reason);
        }

        vm.stopBroadcast();
    }
}
