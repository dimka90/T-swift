// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProcurementV2.sol";
import "../src/interfaces/ITOKEN.sol";

/**
 * @title InteractionDemo
 * @notice Demonstrates ProcurementV2 interactions including reputation system
 * @dev Run with: forge script contracts/script/InteractionDemo.s.sol --rpc-url <RPC_URL>
 */
contract InteractionDemo is Script {
    ProcurementV2 procurement;
    ITOKEN token;
    
    // Test addresses
    address agency = address(0x1);
    address contractor1 = address(0x2);
    address contractor2 = address(0x3);
    
    // Token address (cUSD on Celo)
    address constant TOKEN_ADDRESS = 0x765dE816845861e75a25FCA122BB6Caa78443cB5;
    
    // Budget amounts
    uint256 constant PROJECT_BUDGET = 1000e18;
    uint256 constant MILESTONE_AMOUNT = 500e18;

    function run() public {
        console.log("=== ProcurementV2 Interaction Demo ===");
        console.log("Demonstrating reputation system features");
        console.log("");
        
        // This would be the deployed contract address
        // For demo purposes, we'll show the expected interactions
        demonstrateProjectCreation();
        demonstrateMilestoneWorkflow();
        demonstrateRatingSystem();
        demonstrateVerification();
        demonstratePenalties();
    }

    function demonstrateProjectCreation() internal view {
        console.log("--- Project Creation ---");
        console.log("Agency creates project with budget");
        console.log("  - Description: Website Development");
        console.log("  - Budget: 1000 cUSD");
        console.log("  - Contractor: 0x2...");
        console.log("  - Duration: 30 days");
        console.log("");
        console.log("Expected: Project ID 1 created");
        console.log("Reputation: Contractor totalProjects = 1");
        console.log("Reputation: Agency totalProjects = 1");
        console.log("");
    }

    function demonstrateMilestoneWorkflow() internal view {
        console.log("--- Milestone Workflow ---");
        console.log("1. Agency creates milestone");
        console.log("   - Amount: 500 cUSD");
        console.log("   - Due date: 14 days");
        console.log("");
        console.log("2. Contractor submits deliverables");
        console.log("   - IPFS hash: QmHash123...");
        console.log("   - Status: SUBMITTED");
        console.log("");
        console.log("3. Agency approves milestone");
        console.log("   - Status: APPROVED");
        console.log("");
        console.log("4. Agency releases payment");
        console.log("   - Amount transferred: 500 cUSD");
        console.log("   - Status: PAID");
        console.log("");
        console.log("Expected: Contractor receives 500 cUSD");
        console.log("");
    }

    function demonstrateRatingSystem() internal view {
        console.log("--- Rating System ---");
        console.log("After project completion:");
        console.log("");
        console.log("1. Agency rates contractor");
        console.log("   - Score: 5 stars");
        console.log("   - Comment: 'Excellent work!'");
        console.log("");
        console.log("2. Contractor rates agency");
        console.log("   - Score: 4 stars");
        console.log("   - Comment: 'Good communication'");
        console.log("");
        console.log("Expected Contractor Reputation:");
        console.log("  - ratingCount: 1");
        console.log("  - totalRating: 5");
        console.log("  - averageRating: 500 (5.0 stars)");
        console.log("  - completedProjects: 1");
        console.log("");
        console.log("Expected Agency Reputation:");
        console.log("  - ratingCount: 1");
        console.log("  - totalRating: 4");
        console.log("  - averageRating: 400 (4.0 stars)");
        console.log("  - completedProjects: 1");
        console.log("");
    }

    function demonstrateVerification() internal view {
        console.log("--- Verification System ---");
        console.log("Admin verifies contractor");
        console.log("  - Contractor: 0x2...");
        console.log("  - Status: VERIFIED");
        console.log("");
        console.log("Admin verifies agency with level");
        console.log("  - Agency: 0x1...");
        console.log("  - Level: 2 (ADVANCED)");
        console.log("  - Status: VERIFIED");
        console.log("");
        console.log("Expected Contractor Reputation:");
        console.log("  - isVerified: true");
        console.log("");
        console.log("Expected Agency Reputation:");
        console.log("  - isVerified: true");
        console.log("  - verificationLevel: 2");
        console.log("");
    }

    function demonstratePenalties() internal view {
        console.log("--- Penalty System ---");
        console.log("Admin applies penalty to contractor");
        console.log("  - Contractor: 0x2...");
        console.log("  - Points: 10");
        console.log("  - Reason: 'Late delivery'");
        console.log("");
        console.log("Admin applies another penalty");
        console.log("  - Contractor: 0x2...");
        console.log("  - Points: 5");
        console.log("  - Reason: 'Poor quality'");
        console.log("");
        console.log("Expected Contractor Reputation:");
        console.log("  - penaltyPoints: 15");
        console.log("");
    }
}
