# Access Control System - ProcurementV2

## Overview

The ProcurementV2 contract implements a comprehensive role-based access control (RBAC) system to manage permissions and ensure secure operations across different user types.

## Roles

### 1. **ADMIN_ROLE** (`0x...`)
- **Purpose**: Administrative functions and system management
- **Permissions**:
  - Grant/revoke roles to other addresses
  - Verify contractors and agencies
  - Apply penalties to contractors
  - Manage system-level operations
- **Typical Users**: Contract owner, platform administrators

### 2. **AGENCY_ROLE** (`0x...`)
- **Purpose**: Government agencies and procurement entities
- **Permissions**:
  - Create projects with budget allocation
  - Create milestones for projects
  - Approve/reject milestone submissions
  - Release milestone payments
  - Rate contractors after project completion
- **Typical Users**: Government agencies, procurement departments

### 3. **CONTRACTOR_ROLE** (`0x...`)
- **Purpose**: Service providers and contractors
- **Permissions**:
  - Submit milestone deliverables
  - Receive payments for approved milestones
  - Rate agencies after project completion
- **Typical Users**: Contractors, service providers, freelancers

### 4. **ARBITRATOR_ROLE** (`0x...`)
- **Purpose**: Dispute resolution and arbitration
- **Permissions**:
  - Resolve disputes between agencies and contractors
  - Make binding decisions on contested milestones
  - Mediate payment disputes
- **Typical Users**: Arbitrators, mediators, dispute resolution specialists

## Role Management Functions

### Grant Role
```solidity
function grantRole(bytes32 _role, address _account) external onlyAdmin
```
- Grants a specific role to an address
- Only callable by ADMIN_ROLE members
- Emits `RoleGranted` event

### Revoke Role
```solidity
function revokeRole(bytes32 _role, address _account) external onlyAdmin
```
- Revokes a specific role from an address
- Only callable by ADMIN_ROLE members
- Emits `RoleRevoked` event

### Check Role
```solidity
function hasRole(bytes32 _role, address _account) public view returns (bool)
```
- Checks if an address has a specific role
- Public view function, no gas cost

### Get Role Members
```solidity
function getRoleMembers(bytes32 _role) external view returns (address[] memory)
```
- Returns all addresses that have a specific role
- Useful for auditing and monitoring

## Access Control Modifiers

### `onlyAdmin`
- Restricts function to ADMIN_ROLE members
- Used for: role management, verification, penalties

### `onlyAgencyRole`
- Restricts function to AGENCY_ROLE members
- Used for: project creation, milestone management

### `onlyContractorRole`
- Restricts function to CONTRACTOR_ROLE members
- Used for: milestone submission, rating

### `onlyArbitrator`
- Restricts function to ARBITRATOR_ROLE members
- Used for: dispute resolution

### `onlyRole(bytes32 _role)`
- Generic modifier for custom role checks
- Allows flexible permission management

## Function Access Matrix

| Function | ADMIN | AGENCY | CONTRACTOR | ARBITRATOR | Notes |
|----------|-------|--------|------------|------------|-------|
| grantRole | ✅ | ❌ | ❌ | ❌ | Role management |
| revokeRole | ✅ | ❌ | ❌ | ❌ | Role management |
| createProject | ✅ | ✅ | ❌ | ❌ | Agency creates projects |
| createMilestone | ✅ | ✅ | ❌ | ❌ | Agency creates milestones |
| submitMilestone | ✅ | ❌ | ✅ | ❌ | Contractor submits work |
| approveMilestone | ✅ | ✅ | ❌ | ❌ | Agency approves work |
| rejectMilestone | ✅ | ✅ | ❌ | ❌ | Agency rejects work |
| releaseMilestonePayment | ✅ | ✅ | ❌ | ❌ | Agency releases payment |
| rateContractor | ✅ | ✅ | ❌ | ❌ | Agency rates contractor |
| rateAgency | ✅ | ❌ | ✅ | ❌ | Contractor rates agency |
| verifyContractor | ✅ | ❌ | ❌ | ❌ | Admin verification |
| verifyAgency | ✅ | ❌ | ❌ | ❌ | Admin verification |
| applyPenalty | ✅ | ❌ | ❌ | ❌ | Admin penalties |

## Events

### RoleGranted
```solidity
event RoleGranted(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);
```
- Emitted when a role is granted to an address
- Useful for tracking role changes

### RoleRevoked
```solidity
event RoleRevoked(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);
```
- Emitted when a role is revoked from an address
- Useful for tracking role changes

## Implementation Details

### Role Storage
- Roles are stored in a mapping: `mapping(address => mapping(bytes32 => bool))`
- Role members are tracked in: `mapping(bytes32 => address[])`
- Enables efficient lookups and enumeration

### Role Initialization
- Contract owner automatically receives ADMIN_ROLE on deployment
- Other roles must be explicitly granted by admins

### Role Revocation
- When a role is revoked, the address is removed from the role members array
- Uses swap-and-pop technique for efficient removal

## Usage Examples

### Granting Roles

```solidity
// Grant AGENCY_ROLE to a government agency
grantRole(AGENCY_ROLE, 0x1234...);

// Grant CONTRACTOR_ROLE to a contractor
grantRole(CONTRACTOR_ROLE, 0x5678...);

// Grant ARBITRATOR_ROLE to a mediator
grantRole(ARBITRATOR_ROLE, 0x9abc...);
```

### Checking Permissions

```solidity
// Check if address is an agency
if (hasRole(AGENCY_ROLE, msg.sender)) {
    // Perform agency-specific operations
}

// Get all agencies
address[] memory agencies = getRoleMembers(AGENCY_ROLE);
```

### Revoking Roles

```solidity
// Remove agency status
revokeRole(AGENCY_ROLE, 0x1234...);

// Remove contractor status
revokeRole(CONTRACTOR_ROLE, 0x5678...);
```

## Security Considerations

1. **Role Separation**: Each role has distinct permissions to prevent privilege escalation
2. **Admin Control**: Only admins can grant/revoke roles, preventing unauthorized access
3. **Event Logging**: All role changes are logged for audit trails
4. **Access Modifiers**: Functions use specific modifiers to enforce permissions
5. **Zero Address Check**: Role management prevents granting roles to zero address

## Future Enhancements

1. **Multi-Sig Admin**: Require multiple admins to approve role changes
2. **Time-Locked Roles**: Implement time delays for role revocation
3. **Role Expiration**: Add expiration dates to roles
4. **Delegation**: Allow role holders to delegate permissions
5. **Hierarchical Roles**: Implement role inheritance

## Deployment Checklist

- [ ] Deploy contract with owner address
- [ ] Verify owner has ADMIN_ROLE
- [ ] Grant AGENCY_ROLE to government agencies
- [ ] Grant CONTRACTOR_ROLE to contractors
- [ ] Grant ARBITRATOR_ROLE to arbitrators
- [ ] Test role-based access controls
- [ ] Verify event logging works correctly
- [ ] Document role assignments

## Testing

Run the following tests to verify access control:

```bash
# Test role management
forge test --match-contract AccessControl

# Test function access restrictions
forge test --match-contract FunctionAccess

# Test event logging
forge test --match-contract RoleEvents
```

## Support

For questions or issues with access control, please refer to:
- Smart contract documentation
- Test files in `contracts/test/`
- GitHub issues and discussions
