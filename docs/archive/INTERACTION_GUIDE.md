# ProcurementV2 Interaction Guide

## Overview
This guide demonstrates how to interact with the ProcurementV2 contract and its new Reputation System on Celo Mainnet.

## Contract Interactions

### 1. Project Creation

**Function**: `createProject(string, uint256, address, uint256, uint256)`

**Parameters**:
- `description`: Project description
- `budget`: Total budget in cUSD (18 decimals)
- `contractorAddress`: Contractor wallet address
- `startDate`: Project start timestamp
- `endDate`: Project end timestamp

**Example**:
```solidity
procurement.createProject(
    "Website Development",
    1000e18,  // 1000 cUSD
    0x2222...,
    block.timestamp,
    block.timestamp + 30 days
)
```

**Expected Result**:
- Project ID 1 created
- Contractor reputation initialized: totalProjects = 1
- Agency reputation initialized: totalProjects = 1
- Tokens transferred to contract escrow

---

### 2. Milestone Creation

**Function**: `createMilestone(uint256, string, uint256, uint256)`

**Parameters**:
- `projectId`: Project ID
- `description`: Milestone description
- `amount`: Payment amount in cUSD
- `dueDate`: Milestone due date timestamp

**Example**:
```solidity
procurement.createMilestone(
    1,
    "Frontend Development",
    500e18,  // 500 cUSD
    block.timestamp + 14 days
)
```

**Expected Result**:
- Milestone ID 1 created
- Status: PENDING
- Amount reserved from project budget

---

### 3. Milestone Submission

**Function**: `submitMilestone(uint256, string)`

**Parameters**:
- `milestoneId`: Milestone ID
- `deliverablesCid`: IPFS hash of deliverables

**Example**:
```solidity
procurement.submitMilestone(
    1,
    "QmHash123456789"
)
```

**Expected Result**:
- Milestone status: SUBMITTED
- Deliverables stored on-chain
- Timestamp recorded

---

### 4. Milestone Approval

**Function**: `approveMilestone(uint256)`

**Parameters**:
- `milestoneId`: Milestone ID

**Example**:
```solidity
procurement.approveMilestone(1)
```

**Expected Result**:
- Milestone status: APPROVED
- Ready for payment release

---

### 5. Payment Release

**Function**: `releaseMilestonePayment(uint256)`

**Parameters**:
- `milestoneId`: Milestone ID

**Example**:
```solidity
procurement.releaseMilestonePayment(1)
```

**Expected Result**:
- Milestone status: PAID
- Tokens transferred to contractor
- Payment tracked in contract

---

### 6. Rating Contractor

**Function**: `rateContractor(address, uint256, uint8, string)`

**Parameters**:
- `contractorAddress`: Contractor address
- `projectId`: Project ID
- `score`: Rating 1-5
- `comment`: Rating comment

**Example**:
```solidity
procurement.rateContractor(
    0x2222...,
    1,
    5,
    "Excellent work and timely delivery!"
)
```

**Expected Result**:
- Rating recorded
- Contractor reputation updated:
  - ratingCount: 1
  - totalRating: 5
  - averageRating: 500 (5.0 stars)

---

### 7. Rating Agency

**Function**: `rateAgency(address, uint256, uint8, string)`

**Parameters**:
- `agencyAddress`: Agency address
- `projectId`: Project ID
- `score`: Rating 1-5
- `comment`: Rating comment

**Example**:
```solidity
procurement.rateAgency(
    0x1111...,
    1,
    4,
    "Good communication and support"
)
```

**Expected Result**:
- Rating recorded
- Agency reputation updated:
  - ratingCount: 1
  - totalRating: 4
  - averageRating: 400 (4.0 stars)

---

### 8. Verify Contractor

**Function**: `verifyContractor(address)` (Admin only)

**Parameters**:
- `contractorAddress`: Contractor address

**Example**:
```solidity
procurement.verifyContractor(0x2222...)
```

**Expected Result**:
- Contractor reputation updated:
  - isVerified: true
- Event emitted: ContractorVerified

---

### 9. Verify Agency

**Function**: `verifyAgency(address, uint256)` (Admin only)

**Parameters**:
- `agencyAddress`: Agency address
- `verificationLevel`: 1 (BASIC), 2 (ADVANCED), 3 (PREMIUM)

**Example**:
```solidity
procurement.verifyAgency(0x1111..., 2)
```

**Expected Result**:
- Agency reputation updated:
  - isVerified: true
  - verificationLevel: 2
- Event emitted: AgencyVerified

---

### 10. Apply Penalty

**Function**: `applyPenalty(address, uint256, string)` (Admin only)

**Parameters**:
- `contractorAddress`: Contractor address
- `points`: Penalty points
- `reason`: Penalty reason

**Example**:
```solidity
procurement.applyPenalty(
    0x2222...,
    10,
    "Late delivery on project #5"
)
```

**Expected Result**:
- Contractor reputation updated:
  - penaltyPoints: 10
- Event emitted: PenaltyApplied

---

## Query Functions

### Get Contractor Reputation

**Function**: `getContractorReputation(address)`

**Returns**:
```solidity
{
    contractorAddress: address,
    totalProjects: uint256,
    completedProjects: uint256,
    totalRating: uint256,
    ratingCount: uint256,
    averageRating: uint256,  // (totalRating * 100) / ratingCount
    rejectedMilestones: uint256,
    lateDeliveries: uint256,
    isVerified: bool,
    penaltyPoints: uint256,
    lastUpdated: uint256
}
```

**Example**:
```solidity
ContractorReputation memory rep = procurement.getContractorReputation(0x2222...);
uint256 avgRating = rep.averageRating / 100;  // Convert to 0-5 scale
```

---

### Get Agency Reputation

**Function**: `getAgencyReputation(address)`

**Returns**:
```solidity
{
    agencyAddress: address,
    totalProjects: uint256,
    completedProjects: uint256,
    totalRating: uint256,
    ratingCount: uint256,
    averageRating: uint256,  // (totalRating * 100) / ratingCount
    isVerified: bool,
    verificationLevel: uint256,  // 0: UNVERIFIED, 1: BASIC, 2: ADVANCED, 3: PREMIUM
    lastUpdated: uint256
}
```

**Example**:
```solidity
AgencyReputation memory rep = procurement.getAgencyReputation(0x1111...);
```

---

### Get Project Ratings

**Function**: `getProjectRatings(uint256)`

**Returns**: Array of Rating structs

**Example**:
```solidity
Rating[] memory ratings = procurement.getProjectRatings(1);
for (uint i = 0; i < ratings.length; i++) {
    console.log("Rater:", ratings[i].rater);
    console.log("Score:", ratings[i].score);
    console.log("Comment:", ratings[i].comment);
}
```

---

## Complete Workflow Example

### Step 1: Create Project
```solidity
// Agency creates project
uint256 projectId = procurement.createProject(
    "Mobile App Development",
    2000e18,  // 2000 cUSD
    0x2222...,  // Contractor
    block.timestamp,
    block.timestamp + 60 days
);
// Result: projectId = 1
```

### Step 2: Create Milestones
```solidity
// Agency creates first milestone
uint256 milestone1 = procurement.createMilestone(
    1,
    "Design & Planning",
    500e18,
    block.timestamp + 14 days
);

// Agency creates second milestone
uint256 milestone2 = procurement.createMilestone(
    1,
    "Development",
    1000e18,
    block.timestamp + 42 days
);

// Agency creates third milestone
uint256 milestone3 = procurement.createMilestone(
    1,
    "Testing & Deployment",
    500e18,
    block.timestamp + 56 days
);
```

### Step 3: Submit Milestones
```solidity
// Contractor submits first milestone
procurement.submitMilestone(1, "QmDesignHash...");

// Contractor submits second milestone
procurement.submitMilestone(2, "QmDevHash...");

// Contractor submits third milestone
procurement.submitMilestone(3, "QmTestHash...");
```

### Step 4: Approve & Release Payments
```solidity
// Agency approves and releases payment for each milestone
for (uint i = 1; i <= 3; i++) {
    procurement.approveMilestone(i);
    procurement.releaseMilestonePayment(i);
}
// Result: Contractor receives 2000 cUSD total
```

### Step 5: Rate Each Other
```solidity
// Agency rates contractor
procurement.rateContractor(0x2222..., 1, 5, "Excellent work!");

// Contractor rates agency
procurement.rateAgency(0x1111..., 1, 5, "Great communication!");
```

### Step 6: Verify & Check Reputation
```solidity
// Admin verifies contractor
procurement.verifyContractor(0x2222...);

// Admin verifies agency
procurement.verifyAgency(0x1111..., 2);

// Check final reputation
ContractorReputation memory contractorRep = 
    procurement.getContractorReputation(0x2222...);
AgencyReputation memory agencyRep = 
    procurement.getAgencyReputation(0x1111...);

// Expected:
// contractorRep.completedProjects = 1
// contractorRep.averageRating = 500 (5.0 stars)
// contractorRep.isVerified = true
// agencyRep.completedProjects = 1
// agencyRep.averageRating = 500 (5.0 stars)
// agencyRep.isVerified = true
```

---

## Events

### ContractorRated
```solidity
event ContractorRated(
    address indexed contractor,
    address indexed rater,
    uint256 indexed projectId,
    uint8 score,
    uint256 timestamp
)
```

### AgencyRated
```solidity
event AgencyRated(
    address indexed agency,
    address indexed rater,
    uint256 indexed projectId,
    uint8 score,
    uint256 timestamp
)
```

### ContractorVerified
```solidity
event ContractorVerified(
    address indexed contractor,
    uint256 timestamp
)
```

### AgencyVerified
```solidity
event AgencyVerified(
    address indexed agency,
    uint256 verificationLevel,
    uint256 timestamp
)
```

### PenaltyApplied
```solidity
event PenaltyApplied(
    address indexed contractor,
    uint256 points,
    string reason,
    uint256 timestamp
)
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Budget must be greater than 0" | Budget is 0 | Set budget > 0 |
| "Invalid contractor address" | Contractor is address(0) | Use valid address |
| "End date must be after start date" | Invalid dates | Set endDate > startDate |
| "Insufficient allowance" | Token approval too low | Approve more tokens |
| "Score must be between 1 and 5" | Invalid rating | Use score 1-5 |
| "Project must be completed" | Rating incomplete project | Wait for completion |
| "Only project agency can rate" | Wrong caller | Use agency address |
| "Only owner can call this" | Not admin | Use owner address |

---

## Gas Estimates

| Operation | Gas Cost |
|-----------|----------|
| Create Project | ~150,000 |
| Create Milestone | ~120,000 |
| Submit Milestone | ~100,000 |
| Approve Milestone | ~80,000 |
| Release Payment | ~120,000 |
| Rate Contractor | ~100,000 |
| Rate Agency | ~100,000 |
| Verify Contractor | ~50,000 |
| Verify Agency | ~50,000 |
| Apply Penalty | ~50,000 |

---

## Best Practices

1. **Always approve tokens before creating projects**
   ```solidity
   token.approve(procurementAddress, amount);
   ```

2. **Use IPFS for deliverables**
   - Upload files to IPFS
   - Store hash in contract
   - Retrieve files from IPFS when needed

3. **Rate after project completion**
   - Only completed projects can be rated
   - Provide meaningful comments
   - Use accurate scores

4. **Monitor reputation metrics**
   - Check contractor ratings before hiring
   - Verify agency credentials
   - Review penalty history

5. **Handle errors gracefully**
   - Check return values
   - Validate inputs
   - Catch exceptions

---

## Frontend Integration

### Web3.js Example
```javascript
const contract = new ethers.Contract(
    PROCUREMENT_ADDRESS,
    PROCUREMENT_ABI,
    signer
);

// Create project
const tx = await contract.createProject(
    "Project Name",
    ethers.parseEther("1000"),
    contractorAddress,
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
);

// Get reputation
const rep = await contract.getContractorReputation(contractorAddress);
console.log("Average Rating:", rep.averageRating / 100);
```

---

## Support & Resources

- **Contract Address**: [To be deployed]
- **Token Address**: 0x765dE816845861e75a25FCA122BB6Caa78443cB5 (cUSD)
- **Network**: Celo Mainnet
- **Explorer**: https://explorer.celo.org

---

**Last Updated**: December 12, 2025
**Version**: ProcurementV2 with Reputation System
