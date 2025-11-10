# 🌀 Tswift – Decentralized Procurement Management System

## Overview

**Tswift** is a blockchain-based procurement contract system designed to enhance **transparency, accountability, and trust** in government or enterprise project management.  
It facilitates collaboration among **Government Agencies**, **Contractors**, and **Whistleblowers** through smart contracts, ensuring fair project allocation, milestone tracking, and fund disbursement — all powered by Ethereum-compatible networks.

---

## ⚙️ Features

- **Contractor Registration**  
  Onboard contractors with verifiable company and tax details, including decentralized document storage via IPFS CIDs.

- **Project Creation and Assignment**  
  Agencies can create and assign projects to verified contractors, locking project budgets in ERC20 tokens.

- **Milestone Submission and Verification**  
  Contractors can submit project milestones with IPFS-hosted evidence (e.g., image CIDs).

- **Project Rejection Tracking**  
  Agencies can reject milestones, and such actions are transparently stored on-chain.

- **Auditability and Transparency**  
  Every project, contractor, and milestone event is publicly recorded on-chain.

---

## 🧱 Smart Contract Architecture

### Contract: `Procurement.sol`

| Component | Description |
|------------|-------------|
| **Owner** | The deployer of the contract, typically the system administrator. |
| **Agency** | Government or institutional body that creates and funds projects. |
| **Contractor** | Registered entity executing projects. |
| **Whistleblower (planned)** | Role for reporting corruption or irregularities. |

### Key Structs

- `Contractor` — Stores company information, registration number, and proof documents.
- `Project` — Represents a single procurement project with metadata, budget, and timeline.
- `Milestone` — (Future) Defines project sub-stages, deliverables, and payment checkpoints.
- `RejectedMilestone` — Keeps records of milestones rejected by agencies.
- `CompletedProjects` — Archives finalized projects.

### Important Mappings

| Mapping | Purpose |
|----------|----------|
| `projects` | Maps project ID → Project details |
| `contractorProjects` | Maps contractor address → Array of assigned project IDs |
| `contractor` | Maps registration number → Contractor details |
| `rejectedMilestones` | Maps contractor → List of rejected milestones |
| `agency_Contractor` | Maps agency → Assigned contractor |

---

## 🔑 Core Functions

| Function | Description |
|-----------|-------------|
| `createContractor(...)` | Registers a new contractor with company and verification details. |
| `createProject(...)` | Allows an agency to create and fund a new project for a contractor. |
| `SubmitProject(...)` | Enables a contractor to submit project deliverables with image proof (CID). |
| `RejectMilestones(...)` | Lets agencies reject specific milestones. |
| `getAllContractors()` | Returns all registered contractors. |
| `getContractor(address)` | Fetches details of a specific contractor. |
| `getContractorsProject(address)` | Returns all projects associated with a contractor. |
| `getSubmittedProject(address)` | Retrieves all projects submitted by a contractor. |
| `getRejectedProject(address)` | Fetches rejected milestones for a contractor. |

---

## 🪙 Token Integration

Tswift uses an **ERC20 token** for project funding and payments.  
The contract ensures that:
- Agencies must approve token spending (`IERC20.approve`) before creating projects.
- Tokens are transferred from the agency to the `Procurement` contract during project creation.

```solidity
uint256 allowance = IERC20(tokenAddress).allowance(msg.sender, address(this));
require(_budget <= allowance , "No allowance to spend funds at the moment");
IERC20(tokenAddress).transferFrom(msg.sender, address(this), _budget);
##🚀 Deployment
##Prerequisites

-Foundryinstalled (forge)

- Solidity ≥ 0.8.26

- Node.js ≥ 18.x

- A deployed ERC20 token contract
