# Reputation System Implementation

## Overview
Implemented a comprehensive reputation system for the Tswift procurement platform to track contractor and agency performance, ratings, and verification status.

## Features Implemented

### 1. Contractor Reputation Tracking
- **Total Projects**: Count of all projects assigned to contractor
- **Completed Projects**: Count of successfully completed projects
- **Rating System**: 1-5 star ratings from agencies
- **Average Rating**: Calculated as (totalRating * 100) / ratingCount
- **Rejected Milestones**: Track number of rejected submissions
- **Late Deliveries**: Track late delivery count
- **Verification Status**: Boolean flag for verified contractors
- **Penalty Points**: Accumulate penalties for violations

### 2. Agency Reputation Tracking
- **Total Projects**: Count of all projects created
- **Completed Projects**: Count of successfully completed projects
- **Rating System**: 1-5 star ratings from contractors
- **Average Rating**: Calculated as (totalRating * 100) / ratingCount
- **Verification Status**: Boolean flag for verified agencies
- **Verification Level**: 3-tier system (BASIC=1, ADVANCED=2, PREMIUM=3)

### 3. Rating System
- **Bidirectional Ratings**: Agencies rate contractors and vice versa
- **Project-Based**: Ratings tied to specific projects
- **Immutable Records**: All ratings stored with timestamp and comment
- **Validation**: Only completed projects can be rated

### 4. Verification System
- **Contractor Verification**: Admin can verify contractors
- **Agency Verification**: Admin can assign verification levels
- **Verification Levels**: 
  - Level 1: BASIC verification
  - Level 2: ADVANCED verification
  - Level 3: PREMIUM verification

### 5. Penalty System
- **Admin-Controlled**: Only owner can apply penalties
- **Accumulative**: Penalties stack for multiple violations
- **Tracked**: All penalties recorded with reason and timestamp

## Smart Contract Changes

### New Structs (Struct.sol)
```solidity
struct ContractorReputation {
    address contractorAddress;
    uint256 totalProjects;
    uint256 completedProjects;
    uint256 totalRating;
    uint256 ratingCount;
    uint256 averageRating;
    uint256 rejectedMilestones;
    uint256 lateDeliveries;
    bool isVerified;
    uint256 penaltyPoints;
    uint256 lastUpdated;
}

struct AgencyReputation {
    address agencyAddress;
    uint256 totalProjects;
    uint256 completedProjects;
    uint256 totalRating;
    uint256 ratingCount;
    uint256 averageRating;
    bool isVerified;
    uint256 verificationLevel;
    uint256 lastUpdated;
}

struct Rating {
    address rater;
    address ratee;
    uint256 projectId;
    uint8 score;
    string comment;
    uint256 timestamp;
}
```

### New Functions (ProcurementV2.sol)

#### Rating Functions
- `rateContractor(address, uint256, uint8, string)`: Rate a contractor
- `rateAgency(address, uint256, uint8, string)`: Rate an agency
- `getProjectRatings(uint256)`: Get all ratings for a project

#### Reputation Query Functions
- `getContractorReputation(address)`: Get contractor reputation data
- `getAgencyReputation(address)`: Get agency reputation data

#### Verification Functions
- `verifyContractor(address)`: Verify a contractor (admin only)
- `verifyAgency(address, uint256)`: Verify agency with level (admin only)

#### Penalty Functions
- `applyPenalty(address, uint256, string)`: Apply penalty points (admin only)

### New Events
- `ContractorRated`: Emitted when contractor is rated
- `AgencyRated`: Emitted when agency is rated
- `ContractorVerified`: Emitted when contractor is verified
- `AgencyVerified`: Emitted when agency is verified
- `PenaltyApplied`: Emitted when penalty is applied

### Automatic Reputation Updates
- **On Project Creation**: Initialize reputation records
- **On Milestone Rejection**: Increment rejectedMilestones counter
- **On Project Completion**: Increment completedProjects counter

## Test Coverage

### Reputation Tests (39 passing)
- ✅ Rate contractor with valid score
- ✅ Rate contractor with multiple ratings
- ✅ Rate contractor with invalid score (0, 6)
- ✅ Rate contractor - only agency can rate
- ✅ Rate contractor - project must be completed
- ✅ Rate agency with valid score
- ✅ Rate agency with multiple ratings
- ✅ Verify contractor (admin only)
- ✅ Verify agency with levels
- ✅ Apply penalties (single and multiple)
- ✅ Get project ratings
- ✅ Reputation initialization on project creation
- ✅ Reputation update on project completion
- ✅ Track rejected milestones in reputation

## Usage Examples

### Rating a Contractor
```solidity
// After project completion
procurement.rateContractor(
    contractorAddress,
    projectId,
    5,  // 5-star rating
    "Excellent work and timely delivery!"
);
```

### Verifying a Contractor
```solidity
// Admin verification
procurement.verifyContractor(contractorAddress);
```

### Applying Penalties
```solidity
// Admin penalty for late delivery
procurement.applyPenalty(
    contractorAddress,
    10,  // penalty points
    "Late delivery on project #5"
);
```

### Querying Reputation
```solidity
// Get contractor reputation
ContractorReputation memory rep = procurement.getContractorReputation(contractorAddress);
uint256 avgRating = rep.averageRating / 100;  // Convert to 0-5 scale
```

## Integration Points

### Frontend Integration
The reputation system can be integrated into the frontend to:
- Display contractor/agency ratings and verification status
- Show reputation metrics on profile pages
- Display penalty history
- Show project completion rates
- Highlight verified contractors/agencies

### Future Enhancements
- Dispute resolution for ratings
- Reputation decay over time
- Milestone-based reputation bonuses
- Automated penalty triggers
- Reputation-based contractor filtering

## Security Considerations
- Rating validation (1-5 score range)
- Project completion verification before rating
- Admin-only verification and penalty functions
- Immutable rating records with timestamps
- Access control on all reputation functions

## Gas Optimization
- Efficient reputation tracking with minimal storage
- Batch operations possible for admin functions
- Indexed mappings for quick lookups
- Calculated averages to avoid storage overhead

## Deployment Notes
- No breaking changes to existing contract interface
- Backward compatible with current projects
- Reputation data initialized on first project creation
- All reputation functions are optional (non-blocking)
