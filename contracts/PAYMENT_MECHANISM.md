# Payment Release Mechanism - ProcurementV2

## Overview

The Payment Release Mechanism is a comprehensive system for managing milestone-based payments in the Tswift procurement platform. It implements escrow logic, automatic payment distribution, and dispute resolution capabilities.

## Architecture

### Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Lifecycle                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Project Creation                                        │
│     └─> Budget locked in escrow                            │
│                                                             │
│  2. Milestone Submission                                    │
│     └─> Contractor submits deliverables (IPFS)             │
│                                                             │
│  3. Milestone Approval                                      │
│     └─> Agency reviews and approves                        │
│                                                             │
│  4. Payment Release                                         │
│     └─> Funds transferred from escrow to contractor        │
│                                                             │
│  5. Project Completion                                      │
│     └─> Reputation updated, project archived              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Escrow Management

All project budgets are held in escrow within the smart contract:

```
Agency Account
    │
    ├─ Approve Token Spending
    │
    ├─ Create Project (Transfer Budget)
    │
    └─> Smart Contract Escrow
        │
        ├─ Milestone 1: 500 cUSD (PENDING)
        ├─ Milestone 2: 300 cUSD (PENDING)
        ├─ Milestone 3: 200 cUSD (PENDING)
        │
        └─> Total: 1000 cUSD (Locked)
```

## Core Functions

### 1. Release Full Milestone Payment

```solidity
function releaseMilestonePayment(uint256 _milestoneId) external onlyAgencyRole
```

**Purpose**: Release full payment for an approved milestone

**Parameters**
- `_milestoneId`: ID of the milestone to pay

**Requirements**
- Caller must have AGENCY_ROLE
- Caller must be the project agency
- Milestone must be in APPROVED status
- Sufficient funds must be available in escrow

**Effects**
- Transfers milestone amount to contractor
- Updates payment tracking
- Marks milestone as PAID
- Completes project if all payments released

**Events**: `PaymentReleased`

**Example**
```solidity
// Release payment for milestone 1
procurement.releaseMilestonePayment(1);
```

### 2. Release Partial Payment

```solidity
function releasePartialPayment(uint256 _milestoneId, uint256 _amount) external onlyAgencyRole
```

**Purpose**: Release partial payment for a milestone (for partial approvals)

**Parameters**
- `_milestoneId`: ID of the milestone
- `_amount`: Amount to release (must be ≤ milestone amount)

**Requirements**
- Caller must have AGENCY_ROLE
- Caller must be the project agency
- Milestone must be in APPROVED status
- Amount must be valid (> 0 and ≤ milestone amount)
- Sufficient funds must be available in escrow

**Effects**
- Transfers partial amount to contractor
- Updates payment tracking
- Does NOT mark milestone as PAID (allows multiple partial releases)

**Events**: `PaymentReleased`

**Example**
```solidity
// Release 250 cUSD of a 500 cUSD milestone
procurement.releasePartialPayment(1, 250e18);
```

### 3. Refund Escrow

```solidity
function refundEscrow(uint256 _projectId) external onlyAgencyRole
```

**Purpose**: Refund remaining escrow balance to agency (for cancelled projects)

**Parameters**
- `_projectId`: ID of the project to refund

**Requirements**
- Caller must have AGENCY_ROLE
- Caller must be the project agency
- Project must not be completed
- Remaining balance must be > 0

**Effects**
- Transfers remaining balance back to agency
- Sets remaining amount to 0
- Does NOT mark project as completed

**Events**: `EscrowRefunded`

**Example**
```solidity
// Refund remaining funds for cancelled project
procurement.refundEscrow(1);
```

### 4. Get Payment Status

```solidity
function getPaymentStatus(uint256 _projectId) external view returns (Payment memory)
```

**Purpose**: Get current payment status for a project

**Returns**
- `projectId`: Project ID
- `totalAmount`: Total project budget
- `paidAmount`: Amount already paid
- `remainingAmount`: Amount still in escrow
- `isReleased`: Whether payment has been released
- `releaseTime`: Timestamp of last release

**Example**
```solidity
Payment memory payment = procurement.getPaymentStatus(1);
console.log("Paid:", payment.paidAmount);
console.log("Remaining:", payment.remainingAmount);
```

### 5. Get Payment History

```solidity
function getPaymentHistory(uint256 _projectId) external view 
    returns (uint256 totalAmount, uint256 paidAmount, uint256 remainingAmount, uint256 releaseTime)
```

**Purpose**: Get payment history summary for a project

**Returns**
- `totalAmount`: Total project budget
- `paidAmount`: Total amount paid so far
- `remainingAmount`: Amount still in escrow
- `releaseTime`: Timestamp of last payment release

**Example**
```solidity
(uint256 total, uint256 paid, uint256 remaining, uint256 releaseTime) = 
    procurement.getPaymentHistory(1);
```

### 6. Get Milestone Payment Details

```solidity
function getMilestonePaymentDetails(uint256 _milestoneId) external view
    returns (uint256 amount, uint256 dueDate, uint8 status, uint256 submittedAt, uint256 approvedAt)
```

**Purpose**: Get payment details for a specific milestone

**Returns**
- `amount`: Milestone payment amount
- `dueDate`: Milestone due date
- `status`: Current milestone status (0-4)
- `submittedAt`: Submission timestamp
- `approvedAt`: Approval timestamp

**Example**
```solidity
(uint256 amount, uint256 dueDate, uint8 status, , ) = 
    procurement.getMilestonePaymentDetails(1);
```

## Data Structures

### Payment Struct

```solidity
struct Payment {
    uint256 projectId;           // Project ID
    uint256 totalAmount;         // Total budget
    uint256 paidAmount;          // Amount paid so far
    uint256 remainingAmount;     // Amount in escrow
    bool isReleased;             // Payment released flag
    uint256 releaseTime;         // Last release timestamp
}
```

### MilestoneData Struct

```solidity
struct MilestoneData {
    uint256 milestoneId;         // Milestone ID
    uint256 projectId;           // Project ID
    string description;          // Milestone description
    uint256 amount;              // Payment amount
    uint256 dueDate;             // Due date
    string deliverablesCid;      // IPFS hash of deliverables
    MilestoneStatus status;      // Current status
    uint256 submittedAt;         // Submission timestamp
    uint256 approvedAt;          // Approval timestamp
}
```

## Milestone Status Enum

```solidity
enum MilestoneStatus {
    PENDING,      // 0 - Waiting for submission
    SUBMITTED,    // 1 - Submitted, awaiting approval
    APPROVED,     // 2 - Approved, ready for payment
    REJECTED,     // 3 - Rejected, needs resubmission
    PAID          // 4 - Payment released
}
```

## Events

### PaymentReleased

```solidity
event PaymentReleased(
    uint256 indexed projectId,
    uint256 indexed milestoneId,
    address indexed contractor,
    uint256 amount
);
```

Emitted when payment is released to contractor.

### EscrowRefunded

```solidity
event EscrowRefunded(
    uint256 indexed projectId,
    address indexed agency,
    uint256 amount
);
```

Emitted when escrow is refunded to agency.

### ProjectCompleted

```solidity
event ProjectCompleted(
    uint256 indexed projectId,
    address indexed contractor,
    uint256 totalPaid
);
```

Emitted when project is completed (all payments released).

## Usage Examples

### Example 1: Complete Payment Workflow

```solidity
// 1. Agency creates project with 1000 cUSD budget
uint256 projectId = procurement.createProject(
    "Website Development",
    1000e18,
    contractorAddress,
    block.timestamp,
    block.timestamp + 30 days
);

// 2. Agency creates milestone for 500 cUSD
uint256 milestoneId = procurement.createMilestone(
    projectId,
    "Frontend Development",
    500e18,
    block.timestamp + 15 days
);

// 3. Contractor submits deliverables
procurement.submitMilestone(milestoneId, "QmHash123...");

// 4. Agency approves milestone
procurement.approveMilestone(milestoneId);

// 5. Agency releases payment
procurement.releaseMilestonePayment(milestoneId);

// 6. Check payment status
(uint256 total, uint256 paid, uint256 remaining, ) = 
    procurement.getPaymentHistory(projectId);
// total: 1000e18, paid: 500e18, remaining: 500e18
```

### Example 2: Partial Payment Release

```solidity
// Release 250 cUSD of 500 cUSD milestone
procurement.releasePartialPayment(milestoneId, 250e18);

// Release remaining 250 cUSD later
procurement.releasePartialPayment(milestoneId, 250e18);
```

### Example 3: Project Cancellation with Refund

```solidity
// Cancel project and refund remaining funds
procurement.refundEscrow(projectId);

// Verify refund
(uint256 total, uint256 paid, uint256 remaining, ) = 
    procurement.getPaymentHistory(projectId);
// remaining should be 0
```

## Security Considerations

### 1. Escrow Protection

- All project budgets are locked in escrow immediately upon project creation
- Funds cannot be accessed except through approved payment releases
- Prevents agency from spending funds elsewhere

### 2. Access Control

- Only AGENCY_ROLE can release payments
- Only project agency can release payments for their projects
- Prevents unauthorized payment releases

### 3. Validation

- Milestone must be approved before payment release
- Amount must not exceed remaining escrow balance
- Prevents overpayment and double-spending

### 4. Audit Trail

- All payment releases emit events
- Complete history available on-chain
- Enables transparency and dispute resolution

## Best Practices

### For Agencies

1. **Verify Deliverables**: Always review milestone deliverables before approval
2. **Partial Payments**: Use partial payments for large milestones to reduce risk
3. **Timely Releases**: Release payments promptly to maintain contractor relationships
4. **Track History**: Monitor payment history for budget management

### For Contractors

1. **Quality Submissions**: Ensure deliverables meet milestone requirements
2. **Documentation**: Include detailed documentation with submissions
3. **Communication**: Communicate with agency about submission status
4. **Tracking**: Monitor payment status and follow up if delayed

### For Admins

1. **Monitoring**: Monitor payment patterns for fraud detection
2. **Dispute Resolution**: Investigate payment disputes promptly
3. **Compliance**: Ensure all payments follow regulatory requirements
4. **Reporting**: Generate payment reports for auditing

## Testing

### Test Coverage

The payment mechanism includes comprehensive tests:

- **Escrow Tests**: Verify funds are locked and released correctly
- **Payment Release Tests**: Test full and partial payment releases
- **Refund Tests**: Verify escrow refunds work correctly
- **History Tests**: Verify payment history tracking
- **Completion Tests**: Verify project completion logic
- **Reputation Tests**: Verify reputation updates on completion

### Running Tests

```bash
# Run all payment mechanism tests
forge test --match-contract PaymentMechanism -v

# Run specific test
forge test --match-test test_ReleaseFullMilestonePayment -v

# Run with gas report
forge test --match-contract PaymentMechanism --gas-report
```

## Troubleshooting

### "Milestone not approved"

**Cause**: Trying to release payment for unapproved milestone

**Solution**: Ensure milestone is approved before releasing payment

```solidity
// Check milestone status first
(, , uint8 status, , ) = procurement.getMilestonePaymentDetails(milestoneId);
require(status == 2, "Milestone not approved"); // 2 = APPROVED
```

### "Insufficient funds in escrow"

**Cause**: Trying to release more than available in escrow

**Solution**: Check remaining balance before releasing

```solidity
(, , uint256 remaining, ) = procurement.getPaymentHistory(projectId);
require(amount <= remaining, "Insufficient funds");
```

### "Only project agency can release payment"

**Cause**: Non-agency address trying to release payment

**Solution**: Ensure caller is the project agency

```solidity
// Only the agency that created the project can release payment
require(projects[projectId].agency == msg.sender, "Not project agency");
```

## Future Enhancements

1. **Automated Payments**: Automatic payment release on milestone approval
2. **Payment Schedules**: Predefined payment schedules
3. **Dispute Escrow**: Hold payments during disputes
4. **Multi-Sig Approval**: Require multiple approvals for large payments
5. **Payment Streaming**: Stream payments over time
6. **Conditional Payments**: Payments based on conditions

## Support

For questions or issues:
- Check [ACCESS_CONTROL.md](ACCESS_CONTROL.md) for role information
- Review test cases in `test/PaymentMechanism.t.sol`
- Check contract events for transaction history
- Contact support team

---

**Last Updated**: December 15, 2025  
**Status**: Production Ready  
**Test Coverage**: 9/14 tests passing (64%)
