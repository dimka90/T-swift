# Role Setup Guide - ProcurementV2

## Quick Start

After deploying ProcurementV2, follow these steps to set up roles for your platform.

## Step 1: Verify Owner Has Admin Role

The contract owner automatically receives the ADMIN_ROLE on deployment. Verify this:

```bash
# Check if owner has admin role
cast call <CONTRACT_ADDRESS> "hasRole(bytes32,address)" \
  $(cast keccak256 "ADMIN_ROLE") <OWNER_ADDRESS>
```

Expected output: `true`

## Step 2: Grant Roles to Agencies

For each government agency that will use the platform:

```bash
# Grant AGENCY_ROLE
cast send <CONTRACT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

Example:
```bash
cast send 0x2a4b6DCBA5f527D0B052F48AC88c78AE8E941694 "grantRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") 0x1234567890123456789012345678901234567890 \
  --private-key $PRIVATE_KEY
```

## Step 3: Grant Roles to Contractors

For each contractor that will use the platform:

```bash
# Grant CONTRACTOR_ROLE
cast send <CONTRACT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak256 "CONTRACTOR_ROLE") <CONTRACTOR_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

## Step 4: Grant Roles to Arbitrators

For dispute resolution specialists:

```bash
# Grant ARBITRATOR_ROLE
cast send <CONTRACT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak256 "ARBITRATOR_ROLE") <ARBITRATOR_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

## Step 5: Verify Roles

Check that roles were granted correctly:

```bash
# Check if address has AGENCY_ROLE
cast call <CONTRACT_ADDRESS> "hasRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS>

# Get all agencies
cast call <CONTRACT_ADDRESS> "getRoleMembers(bytes32)" \
  $(cast keccak256 "AGENCY_ROLE")
```

## Batch Role Assignment

For assigning multiple roles at once, create a script:

```solidity
// scripts/SetupRoles.s.sol
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/ProcurementV2.sol";

contract SetupRoles is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        ProcurementV2 procurement = ProcurementV2(vm.envAddress("CONTRACT_ADDRESS"));
        
        // Grant AGENCY_ROLE to agencies
        address[] memory agencies = new address[](3);
        agencies[0] = 0x1111111111111111111111111111111111111111;
        agencies[1] = 0x2222222222222222222222222222222222222222;
        agencies[2] = 0x3333333333333333333333333333333333333333;
        
        for (uint256 i = 0; i < agencies.length; i++) {
            procurement.grantRole(procurement.AGENCY_ROLE(), agencies[i]);
        }
        
        // Grant CONTRACTOR_ROLE to contractors
        address[] memory contractors = new address[](5);
        contractors[0] = 0x4444444444444444444444444444444444444444;
        contractors[1] = 0x5555555555555555555555555555555555555555;
        contractors[2] = 0x6666666666666666666666666666666666666666;
        contractors[3] = 0x7777777777777777777777777777777777777777;
        contractors[4] = 0x8888888888888888888888888888888888888888;
        
        for (uint256 i = 0; i < contractors.length; i++) {
            procurement.grantRole(procurement.CONTRACTOR_ROLE(), contractors[i]);
        }
        
        // Grant ARBITRATOR_ROLE to arbitrators
        address[] memory arbitrators = new address[](2);
        arbitrators[0] = 0x9999999999999999999999999999999999999999;
        arbitrators[1] = 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa;
        
        for (uint256 i = 0; i < arbitrators.length; i++) {
            procurement.grantRole(procurement.ARBITRATOR_ROLE(), arbitrators[i]);
        }
        
        vm.stopBroadcast();
    }
}
```

Run the script:
```bash
forge script scripts/SetupRoles.s.sol \
  --rpc-url <RPC_URL> \
  --broadcast \
  --verify
```

## Role Verification Checklist

After setup, verify all roles are correctly assigned:

```bash
# 1. Check owner is admin
cast call <CONTRACT_ADDRESS> "hasRole(bytes32,address)" \
  $(cast keccak256 "ADMIN_ROLE") <OWNER_ADDRESS>

# 2. Get all agencies
cast call <CONTRACT_ADDRESS> "getRoleMembers(bytes32)" \
  $(cast keccak256 "AGENCY_ROLE")

# 3. Get all contractors
cast call <CONTRACT_ADDRESS> "getRoleMembers(bytes32)" \
  $(cast keccak256 "CONTRACTOR_ROLE")

# 4. Get all arbitrators
cast call <CONTRACT_ADDRESS> "getRoleMembers(bytes32)" \
  $(cast keccak256 "ARBITRATOR_ROLE")

# 5. Verify specific address has role
cast call <CONTRACT_ADDRESS> "hasRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS>
```

## Managing Roles Over Time

### Adding New Agencies
```bash
cast send <CONTRACT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <NEW_AGENCY_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

### Removing Agencies
```bash
cast send <CONTRACT_ADDRESS> "revokeRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <AGENCY_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

### Promoting Contractor to Arbitrator
```bash
cast send <CONTRACT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak256 "ARBITRATOR_ROLE") <CONTRACTOR_ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

## Monitoring Role Changes

All role changes emit events. Monitor them:

```bash
# Watch for RoleGranted events
cast logs --address <CONTRACT_ADDRESS> \
  "RoleGranted(bytes32 indexed,address indexed,address indexed)" \
  --from-block <START_BLOCK>

# Watch for RoleRevoked events
cast logs --address <CONTRACT_ADDRESS> \
  "RoleRevoked(bytes32 indexed,address indexed,address indexed)" \
  --from-block <START_BLOCK>
```

## Troubleshooting

### "Only admin can call this" Error
- Ensure you're using the admin's private key
- Verify the admin address has ADMIN_ROLE

### Role Not Appearing in getRoleMembers
- Wait for transaction confirmation
- Check transaction receipt for success
- Verify role was actually granted

### Cannot Create Project as Agency
- Ensure AGENCY_ROLE was granted to your address
- Check with: `hasRole(AGENCY_ROLE, your_address)`
- Grant role if needed

## Best Practices

1. **Separate Admin Account**: Use a dedicated admin account for role management
2. **Multi-Sig for Production**: Consider multi-sig wallet for admin operations
3. **Regular Audits**: Periodically review who has which roles
4. **Document Changes**: Keep records of role assignments
5. **Test First**: Test role setup on testnet before mainnet
6. **Monitor Events**: Watch for unauthorized role changes

## Role Hierarchy Recommendations

```
Owner (ADMIN_ROLE)
├── Platform Admins (ADMIN_ROLE)
├── Government Agencies (AGENCY_ROLE)
├── Contractors (CONTRACTOR_ROLE)
└── Arbitrators (ARBITRATOR_ROLE)
```

## Emergency Procedures

### Revoking Compromised Admin
```bash
cast send <CONTRACT_ADDRESS> "revokeRole(bytes32,address)" \
  $(cast keccak256 "ADMIN_ROLE") <COMPROMISED_ADDRESS> \
  --private-key <BACKUP_ADMIN_KEY>
```

### Revoking All Roles from Address
```bash
# Revoke AGENCY_ROLE
cast send <CONTRACT_ADDRESS> "revokeRole(bytes32,address)" \
  $(cast keccak256 "AGENCY_ROLE") <ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>

# Revoke CONTRACTOR_ROLE
cast send <CONTRACT_ADDRESS> "revokeRole(bytes32,address)" \
  $(cast keccak256 "CONTRACTOR_ROLE") <ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>

# Revoke ARBITRATOR_ROLE
cast send <CONTRACT_ADDRESS> "revokeRole(bytes32,address)" \
  $(cast keccak256 "ARBITRATOR_ROLE") <ADDRESS> \
  --private-key <ADMIN_PRIVATE_KEY>
```

## Support

For issues or questions:
1. Check the ACCESS_CONTROL.md documentation
2. Review test cases in contracts/test/AccessControl.t.sol
3. Check contract events for role change history
4. Contact platform support
