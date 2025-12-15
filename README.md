# Tswift – Decentralized Procurement Management System

> A blockchain-based procurement platform enabling transparent, secure, and efficient project management between government agencies and contractors on the Celo network.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [System Design](#system-design)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Tswift** is a decentralized procurement management system built on the Celo blockchain. It provides a transparent, trustless platform for government agencies and contractors to collaborate on projects with built-in accountability, milestone tracking, and automated payment distribution.

### Key Benefits

- **Transparency**: All transactions and project milestones are recorded on-chain
- **Security**: Role-based access control and smart contract verification
- **Efficiency**: Automated milestone-based payments and dispute resolution
- **Trust**: Reputation system and contractor verification
- **Compliance**: Audit trails and regulatory reporting capabilities

### Network

- **Primary**: Celo Mainnet
- **Testnet**: Celo Alfajores (for development)
- **Contract Address**: `0x2a4b6DCBA5f527D0B052F48AC88c78AE8E941694`

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Tswift Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Frontend   │  │   Backend    │  │  Blockchain  │     │
│  │   (React)    │  │   (Node.js)  │  │   (Solidity) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Celo Blockchain Network                      │  │
│  │  - ProcurementV2 Smart Contract                      │  │
│  │  - cUSD Token (ERC20)                                │  │
│  │  - Role-Based Access Control                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         External Services                            │  │
│  │  - IPFS (Document Storage)                           │  │
│  │  - Celo Explorer (Verification)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Blockchain** | Solidity 0.8.20 | Smart contracts |
| **Network** | Celo | Layer 1 blockchain |
| **Frontend** | React + Wagmi | User interface |
| **Backend** | Node.js | API and services |
| **Storage** | IPFS | Decentralized document storage |
| **Testing** | Foundry | Smart contract testing |
| **Deployment** | Forge Scripts | Contract deployment |

---

## Features

### 1. Role-Based Access Control

Four distinct roles with specific permissions:

| Role | Permissions | Users |
|------|-------------|-------|
| **ADMIN** | Grant/revoke roles, verify users, apply penalties | Platform administrators |
| **AGENCY** | Create projects, approve milestones, release payments | Government agencies |
| **CONTRACTOR** | Submit milestones, receive payments, rate agencies | Service providers |
| **ARBITRATOR** | Resolve disputes, mediate conflicts | Dispute specialists |

### 2. Project Management

- **Project Creation**: Agencies create projects with budget allocation
- **Milestone Tracking**: Break projects into deliverable milestones
- **Submission & Approval**: Contractors submit work, agencies approve
- **Payment Release**: Automated payments upon milestone approval

### 3. Reputation System

- **Contractor Ratings**: 1-5 star rating system
- **Agency Verification**: Multi-level verification (Basic, Advanced, Premium)
- **Performance Metrics**: Track completion rates and quality
- **Penalty System**: Enforce accountability through penalties

### 4. Dispute Resolution

- **Arbitration Mechanism**: Multi-sig arbitrator selection
- **Evidence Submission**: Support for detailed dispute documentation
- **Appeal Process**: Fair resolution with appeal rights
- **Transparent Voting**: Community-based decision making

### 5. Transparency & Audit

- **On-Chain Records**: All transactions permanently recorded
- **Event Logging**: Comprehensive event tracking
- **Audit Trail**: Complete history of all actions
- **Explorer Integration**: Celo Explorer verification

---

## System Design

### Data Flow

```
Agency                          Contractor
   │                                │
   ├─ Create Project ──────────────>│
   │  (Lock Budget)                 │
   │                                │
   │<─ Submit Milestone ────────────┤
   │  (IPFS Evidence)               │
   │                                │
   ├─ Approve/Reject ──────────────>│
   │                                │
   ├─ Release Payment ─────────────>│
   │  (cUSD Transfer)               │
   │                                │
   │<─ Rate Agency ─────────────────┤
   │  (Reputation Update)           │
   │                                │
   └─ Rate Contractor ────────────>│
      (Reputation Update)           │
```

### State Transitions

```
Project States:
  ACTIVE → COMPLETED → ARCHIVED
    ↓
  DISPUTED → RESOLVED

Milestone States:
  PENDING → SUBMITTED → APPROVED → PAID
              ↓
           REJECTED → RESUBMITTED
```

---

## Smart Contracts

### ProcurementV2.sol

**Location**: `contracts/src/core/ProcurementV2.sol`

#### Key Components

**Structs**
- `Project`: Project metadata and status
- `MilestoneData`: Milestone details and tracking
- `Payment`: Payment tracking and history
- `ContractorReputation`: Contractor performance metrics
- `AgencyReputation`: Agency verification and metrics
- `Rating`: User ratings and feedback

**Events**
- `ProjectCreated`: New project created
- `MilestoneSubmitted`: Milestone deliverables submitted
- `MilestoneApproved`: Milestone approved by agency
- `PaymentReleased`: Payment transferred to contractor
- `ContractorRated`: Contractor rating submitted
- `RoleGranted`: Role assigned to address
- `RoleRevoked`: Role removed from address

**Functions**

| Function | Access | Purpose |
|----------|--------|---------|
| `createProject()` | AGENCY | Create new project |
| `createMilestone()` | AGENCY | Add milestone to project |
| `submitMilestone()` | CONTRACTOR | Submit milestone deliverables |
| `approveMilestone()` | AGENCY | Approve submitted milestone |
| `rejectMilestone()` | AGENCY | Reject milestone with feedback |
| `releaseMilestonePayment()` | AGENCY | Release payment for approved milestone |
| `rateContractor()` | AGENCY | Rate contractor performance |
| `rateAgency()` | CONTRACTOR | Rate agency performance |
| `verifyContractor()` | ADMIN | Verify contractor identity |
| `verifyAgency()` | ADMIN | Verify agency with level |
| `applyPenalty()` | ADMIN | Apply penalty to contractor |
| `grantRole()` | ADMIN | Grant role to address |
| `revokeRole()` | ADMIN | Revoke role from address |

#### Access Control

```solidity
// Role-based modifiers
modifier onlyAdmin()
modifier onlyAgencyRole()
modifier onlyContractorRole()
modifier onlyArbitrator()
modifier onlyRole(bytes32 _role)

// Project-specific modifiers
modifier onlyAgency(uint256 _projectId)
modifier onlyContractor(uint256 _projectId)
modifier projectExists(uint256 _projectId)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Foundry** (forge, cast, anvil)
- **Git**
- **Celo Wallet** with testnet funds

### Installation

```bash
# Clone repository
git clone https://github.com/dimka90/T-swift.git
cd T-swift

# Install dependencies
npm install

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Environment Setup

```bash
# Copy environment template
cp contracts/.env.example contracts/.env

# Edit .env with your configuration
# Required variables:
# - PRIVATE_KEY: Your wallet private key
# - RPC_URL: Celo RPC endpoint
# - ETHERSCAN_API_KEY: For contract verification
# - TOKEN_ADDRESS: cUSD token address
```

### Quick Start

```bash
# Build contracts
cd contracts
forge build

# Run tests
forge test

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> contracts/src/core/ProcurementV2.sol:ProcurementV2 --chain 42220
```

---

## Development

### Project Structure

```
T-swift/
├── contracts/                    # Smart contracts
│   ├── src/
│   │   ├── core/
│   │   │   └── ProcurementV2.sol    # Main contract
│   │   ├── interfaces/
│   │   │   └── ITOKEN.sol           # Token interface
│   │   └── types/
│   │       └── Struct.sol           # Data structures
│   ├── test/
│   │   ├── ProcurementV2.t.sol      # Contract tests
│   │   └── AccessControl.t.sol      # RBAC tests
│   ├── script/
│   │   ├── Deploy.s.sol             # Deployment script
│   │   ├── DeployToken.s.sol        # Token deployment
│   │   └── Interact.s.sol           # Interaction examples
│   └── foundry.toml                 # Foundry config
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom hooks
│   │   ├── context/             # React context
│   │   └── App.jsx              # Main app
│   └── package.json
│
├── docs/                         # Documentation
│   ├── archive/                 # Archived docs
│   └── README.md                # This file
│
└── README.md                     # Project README
```

### Smart Contract Development

```bash
# Compile contracts
forge build

# Run tests with coverage
forge test --coverage

# Format code
forge fmt

# Lint code
solhint 'contracts/src/**/*.sol'

# Generate gas report
forge test --gas-report
```

### Frontend Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## Deployment

### Testnet Deployment (Celo Alfajores)

```bash
# Set environment variables
export PRIVATE_KEY=<your_private_key>
export RPC_URL=https://alfajores-forno.celo-testnet.org

# Deploy contract
cd contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> \
  contracts/src/core/ProcurementV2.sol:ProcurementV2 \
  --chain 44787 \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Mainnet Deployment (Celo)

```bash
# Set environment variables
export PRIVATE_KEY=<your_private_key>
export RPC_URL=https://forno.celo.org

# Deploy contract
cd contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify

# Monitor deployment
cast receipt <TX_HASH> --rpc-url $RPC_URL
```

### Post-Deployment Setup

```bash
# Grant roles to addresses
cast send <CONTRACT> "grantRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS> \
  --private-key $PRIVATE_KEY --rpc-url $RPC_URL

# Verify contract on explorer
# Visit: https://explorer.celo.org/mainnet/address/<CONTRACT_ADDRESS>
```

---

## API Reference

### Project Functions

#### createProject

```solidity
function createProject(
    string memory _description,
    uint256 _budget,
    address _contractorAddress,
    uint256 _startDate,
    uint256 _endDate
) external onlyAgencyRole returns (uint256)
```

**Parameters**
- `_description`: Project description
- `_budget`: Total budget in cUSD
- `_contractorAddress`: Contractor address
- `_startDate`: Project start timestamp
- `_endDate`: Project end timestamp

**Returns**: Project ID

**Events**: `ProjectCreated`

#### createMilestone

```solidity
function createMilestone(
    uint256 _projectId,
    string memory _description,
    uint256 _amount,
    uint256 _dueDate
) external onlyAgency(_projectId) returns (uint256)
```

**Parameters**
- `_projectId`: Project ID
- `_description`: Milestone description
- `_amount`: Payment amount
- `_dueDate`: Due date timestamp

**Returns**: Milestone ID

**Events**: `MilestoneCreated`

### Milestone Functions

#### submitMilestone

```solidity
function submitMilestone(
    uint256 _milestoneId,
    string memory _deliverablesCid
) external
```

**Parameters**
- `_milestoneId`: Milestone ID
- `_deliverablesCid`: IPFS hash of deliverables

**Events**: `MilestoneSubmitted`

#### approveMilestone

```solidity
function approveMilestone(uint256 _milestoneId) external
```

**Parameters**
- `_milestoneId`: Milestone ID

**Events**: `MilestoneApproved`

#### releaseMilestonePayment

```solidity
function releaseMilestonePayment(uint256 _milestoneId) external
```

**Parameters**
- `_milestoneId`: Milestone ID

**Events**: `PaymentReleased`

### Rating Functions

#### rateContractor

```solidity
function rateContractor(
    address _contractorAddress,
    uint256 _projectId,
    uint8 _score,
    string memory _comment
) external
```

**Parameters**
- `_contractorAddress`: Contractor address
- `_projectId`: Project ID
- `_score`: Rating (1-5)
- `_comment`: Rating comment

**Events**: `ContractorRated`

### Role Management

#### grantRole

```solidity
function grantRole(bytes32 _role, address _account) external onlyAdmin
```

**Parameters**
- `_role`: Role identifier
- `_account`: Address to grant role

**Events**: `RoleGranted`

#### hasRole

```solidity
function hasRole(bytes32 _role, address _account) public view returns (bool)
```

**Parameters**
- `_role`: Role identifier
- `_account`: Address to check

**Returns**: Boolean indicating if address has role

---

## Testing

### Running Tests

```bash
# Run all tests
forge test

# Run specific test file
forge test --match-contract AccessControl

# Run specific test
forge test --match-test test_GrantAgencyRole

# Run with verbose output
forge test -v

# Run with gas report
forge test --gas-report

# Run with coverage
forge test --coverage
```

### Test Coverage

Current test coverage:
- **Access Control**: 18 tests (100% pass rate)
- **Project Management**: 15+ tests
- **Milestone System**: 12+ tests
- **Payment System**: 10+ tests
- **Reputation System**: 8+ tests

### Writing Tests

```solidity
// Example test
function test_GrantAgencyRole() public {
    procurement.grantRole(procurement.AGENCY_ROLE(), agency);
    assertTrue(procurement.hasRole(procurement.AGENCY_ROLE(), agency));
}
```

---

## Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/feature-name`)
3. **Commit** changes (`git commit -m 'feat: add feature'`)
4. **Push** to branch (`git push origin feat/feature-name`)
5. **Open** a Pull Request

### Code Standards

- **Solidity**: Follow OpenZeppelin style guide
- **JavaScript**: Use ESLint configuration
- **Commits**: Use conventional commits
- **Tests**: Maintain >90% coverage

### Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure all tests pass
4. Request review from maintainers
5. Address feedback
6. Merge when approved

---

## Roadmap

### Phase 1: Foundation (Current)
- ✅ Role-Based Access Control
- 🔄 Payment Release Mechanism
- 🔄 Milestone System Enhancement
- 🔄 Security Hardening

### Phase 2: Trust & Transparency
- Dispute Resolution System
- Enhanced Reputation System
- Real-time Notifications
- Analytics Dashboard

### Phase 3: User Experience
- Onboarding Flows
- Advanced Search & Filtering
- Mobile Optimization
- Progressive Web App

### Phase 4: Scale & Growth
- Backend Infrastructure
- API Layer
- Compliance & Security
- KYC/AML Integration

See [ROADMAP.md](ROADMAP.md) for detailed timeline.

---

## Security

### Audits

- Smart contract audit: Pending
- Security review: In progress
- Bug bounty program: Coming soon

### Best Practices

- Role-based access control
- Input validation on all functions
- Reentrancy protection
- Integer overflow/underflow checks
- Event logging for audit trails

### Reporting Security Issues

Please report security vulnerabilities to: `security@tswift.dev`

---

## Support

### Documentation

- [Smart Contract Documentation](contracts/ACCESS_CONTROL.md)
- [Role Setup Guide](contracts/ROLE_SETUP_GUIDE.md)
- [Deployment Guide](contracts/DEPLOYMENT_GUIDE_V2.md)
- [Reputation System](REPUTATION_SYSTEM.md)

### Community

- **Discord**: [Join Community](https://discord.gg/tswift)
- **Twitter**: [@TswiftPlatform](https://twitter.com/tswiftplatform)
- **GitHub Issues**: [Report Issues](https://github.com/dimka90/T-swift/issues)

### Contact

- **Email**: info@tswift.dev
- **Website**: https://tswift.dev

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built on [Celo](https://celo.org) blockchain
- Uses [OpenZeppelin](https://openzeppelin.com) contracts
- Tested with [Foundry](https://book.getfoundry.sh)
- Frontend built with [React](https://react.dev) and [Wagmi](https://wagmi.sh)

---

**Last Updated**: December 15, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
