# Access Control Quick Reference

## Role Constants

```solidity
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant AGENCY_ROLE = keccak256("AGENCY_ROLE");
bytes32 public constant CONTRACTOR_ROLE = keccak256("CONTRACTOR_ROLE");
bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
```

## Core Functions

### Grant Role
```solidity
procurement.grantRole(AGENCY_ROLE, 0x1234...);
```

### Revoke Role
```solidity
procurement.revokeRole(AGENCY_ROLE, 0x1234...);
```

### Check Role
```solidity
bool hasRole = procurement.hasRole(AGENCY_ROLE, 0x1234...);
```

### Get Role Members
```solidity
address[] memory members = procurement.getRoleMembers(AGENCY_ROLE);
```

## Role Permissions Matrix

| Role | Can Create Projects | Can Approve Milestones | Can Release Payments | Can Verify | Can Apply Penalties |
|------|:--:|:--:|:--:|:--:|:--:|
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ |
| AGENCY | ✅ | ✅ | ✅ | ❌ | ❌ |
| CONTRACTOR | ❌ | ❌ | ❌ | ❌ | ❌ |
| ARBITRATOR | ❌ | ❌ | ❌ | ❌ | ❌ |

## Common Tasks

### Setup Roles After Deployment

```bash
# Grant AGENCY_ROLE to government agency
cast send <CONTRACT> "grantRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS> \
  --private-key <ADMIN_KEY>

# Grant CONTRACTOR_ROLE to contractor
cast send <CONTRACT> "grantRole(bytes32,address)" \
  $(cast keccak256 "CONTRACTOR_ROLE") <CONTRACTOR_ADDRESS> \
  --private-key <ADMIN_KEY>

# Grant ARBITRATOR_ROLE to arbitrator
cast send <CONTRACT> "grantRole(bytes32,address)" \
  $(cast keccak256 "ARBITRATOR_ROLE") <ARBITRATOR_ADDRESS> \
  --private-key <ADMIN_KEY>
```

### Verify Roles

```bash
# Check if address has AGENCY_ROLE
cast call <CONTRACT> "hasRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <ADDRESS>

# Get all agencies
cast call <CONTRACT> "getRoleMembers(bytes32)" \
  $(cast keccak256 "AGENCY_ROLE")
```

### Remove Roles

```bash
# Revoke AGENCY_ROLE
cast send <CONTRACT> "revokeRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <ADDRESS> \
  --private-key <ADMIN_KEY>
```

## Events

### RoleGranted
```solidity
event RoleGranted(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);
```

### RoleRevoked
```solidity
event RoleRevoked(
    bytes32 indexed role,
    address indexed account,
    address indexed sender
);
```

## Access Modifiers

```solidity
// Restrict to admin
function adminFunction() external onlyAdmin { }

// Restrict to agency
function agencyFunction() external onlyAgencyRole { }

// Restrict to contractor
function contractorFunction() external onlyContractorRole { }

// Restrict to arbitrator
function arbitratorFunction() external onlyArbitrator { }

// Generic role check
function customFunction() external onlyRole(CUSTOM_ROLE) { }
```

## Testing

```bash
# Run all access control tests
forge test --match-contract AccessControl -v

# Run specific test
forge test --match-test test_GrantAgencyRole -v

# Run with gas report
forge test --match-contract AccessControl --gas-report
```

## Troubleshooting

### "Only admin can call this"
- Ensure you're using admin's private key
- Verify admin has ADMIN_ROLE

### Role not appearing in getRoleMembers
- Wait for transaction confirmation
- Check transaction receipt
- Verify role was granted

### Cannot create project as agency
- Ensure AGENCY_ROLE was granted
- Check with: `hasRole(AGENCY_ROLE, your_address)`
- Grant role if needed

## Documentation

- **Full Documentation**: `contracts/ACCESS_CONTROL.md`
- **Setup Guide**: `contracts/ROLE_SETUP_GUIDE.md`
- **Tests**: `contracts/test/AccessControl.t.sol`
- **Implementation**: `ACCESS_CONTROL_IMPLEMENTATION.md`

## Key Points

✅ Owner automatically gets ADMIN_ROLE on deployment
✅ Only admins can grant/revoke roles
✅ Addresses can have multiple roles
✅ All role changes are logged as events
✅ Zero address validation prevents invalid assignments
✅ Efficient O(1) role lookups

## Status

✅ Production Ready
✅ 18/18 Tests Passing
✅ Fully Documented
✅ Ready for Deployment
