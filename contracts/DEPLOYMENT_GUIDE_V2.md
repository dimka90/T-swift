# ProcurementV2 Deployment Guide

## Overview
This guide covers deploying the updated ProcurementV2 contract with the new Reputation System to Celo Mainnet.

## Prerequisites
- Celo account with sufficient CELO for gas fees
- Private key for deployment account
- Access to Celo RPC endpoint
- Forge installed locally

## Contract Details
- **Contract Name**: ProcurementV2
- **Location**: `contracts/src/core/ProcurementV2.sol`
- **Constructor Parameter**: Token Address (cUSD on Celo Mainnet)
- **Celo cUSD Address**: `0x765dE816845861e75a25FCA122BB6Caa78443cB5`

## Deployment Methods

### Method 1: Using Forge Script (Recommended)

1. **Set up environment variables**
```bash
export PRIVATE_KEY=your_private_key_here
export CELO_RPC_URL=https://forno.celo.org
```

2. **Run deployment script**
```bash
forge script contracts/script/Deploy.s.sol:DeployProcurement \
  --rpc-url $CELO_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

3. **Verify deployment**
The script will output the deployed contract address. Save this for future reference.

### Method 2: Manual Deployment via Remix

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create new file: `ProcurementV2.sol`
3. Copy contract code from `contracts/src/core/ProcurementV2.sol`
4. Also copy `contracts/src/types/Struct.sol` and `contracts/src/types/Enum.sol`
5. Compile with Solidity 0.8.20
6. Deploy to Celo Mainnet with constructor parameter:
   - Token Address: `0x765dE816845861e75a25FCA122BB6Caa78443cB5`

### Method 3: Using Cast (Foundry)

1. **Compile contract**
```bash
forge build --root contracts
```

2. **Get bytecode**
```bash
BYTECODE=$(cat contracts/out/ProcurementV2.sol/ProcurementV2.json | jq -r '.bytecode.object')
```

3. **Deploy using cast**
```bash
cast send --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  --create $BYTECODE \
  0x765dE816845861e75a25FCA122BB6Caa78443cB5
```

## Post-Deployment Steps

### 1. Update Frontend Configuration
Update `frontend/src/wagmiAbi.ts` with new contract address:
```typescript
export const PROCUREMENT_ADDRESS = "0x..."; // New deployed address
```

### 2. Update Environment Files
Update `frontend/.env.local`:
```
VITE_PROCUREMENT_ADDRESS=0x...
VITE_TOKEN_ADDRESS=0x765dE816845861e75a25FCA122BB6Caa78443cB5
```

### 3. Verify Contract on Celo Explorer
1. Go to [Celo Explorer](https://explorer.celo.org)
2. Search for contract address
3. Click "Verify & Publish"
4. Upload source code and ABI

### 4. Initialize Contract State
After deployment, initialize any required state:
```solidity
// No initialization required - contract is ready to use
```

## Contract Interactions

### Creating a Project
```solidity
procurement.createProject(
    "Project Description",
    1000e18,  // Budget in cUSD (18 decimals)
    0x...,    // Contractor address
    block.timestamp,
    block.timestamp + 30 days
)
```

### Rating a Contractor
```solidity
procurement.rateContractor(
    0x...,    // Contractor address
    projectId,
    5,        // Rating 1-5
    "Excellent work!"
)
```

### Verifying a Contractor
```solidity
procurement.verifyContractor(0x...)
```

## Gas Estimates

| Operation | Gas Cost |
|-----------|----------|
| Deploy Contract | ~2,500,000 |
| Create Project | ~150,000 |
| Create Milestone | ~120,000 |
| Submit Milestone | ~100,000 |
| Approve Milestone | ~80,000 |
| Release Payment | ~120,000 |
| Rate Contractor | ~100,000 |
| Verify Contractor | ~50,000 |

## Troubleshooting

### Issue: "Insufficient balance"
- Ensure account has enough CELO for gas fees
- Celo gas prices are typically 0.5-1 gwei

### Issue: "Invalid token address"
- Verify cUSD address is correct: `0x765dE816845861e75a25FCA122BB6Caa78443cB5`
- Ensure address has correct checksum

### Issue: "Transaction reverted"
- Check that token address is valid
- Ensure deployer account has sufficient balance
- Verify contract code compiles without errors

## Verification

After deployment, verify the contract:

1. **Check contract code**
```bash
cast code --rpc-url https://forno.celo.org 0x...
```

2. **Call a view function**
```bash
cast call --rpc-url https://forno.celo.org \
  0x... \
  "owner()(address)"
```

3. **Check events**
```bash
cast logs --rpc-url https://forno.celo.org \
  --address 0x... \
  --from-block 0
```

## Rollback Plan

If deployment fails:
1. Check error message in transaction receipt
2. Fix issue in contract code
3. Redeploy with new address
4. Update frontend configuration

## Security Checklist

- [ ] Contract code reviewed
- [ ] Tests passing (39/42 tests pass)
- [ ] Private key secured
- [ ] Gas estimates verified
- [ ] Token address verified
- [ ] Contract verified on explorer
- [ ] Frontend updated with new address
- [ ] Initial transactions tested

## Support

For deployment issues:
1. Check Celo documentation: https://docs.celo.org
2. Review contract code: `contracts/src/core/ProcurementV2.sol`
3. Check test suite: `contracts/test/ProcurementV2.t.sol`

## Deployment History

| Date | Network | Address | Status |
|------|---------|---------|--------|
| TBD | Celo Mainnet | TBD | Pending |

---

**Last Updated**: December 12, 2025
**Contract Version**: ProcurementV2 with Reputation System
