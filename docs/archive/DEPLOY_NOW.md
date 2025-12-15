# Deploy ProcurementV2 to Celo Mainnet - Quick Start

## Prerequisites
- Private key with CELO for gas fees
- Forge installed (`curl -L https://foundry.paradigm.xyz | bash`)
- Terminal access

---

## Step 1: Set Environment Variables

```bash
export PRIVATE_KEY=your_private_key_here
export CELO_RPC_URL=https://forno.celo.org
```

**Example**:
```bash
export PRIVATE_KEY=f8b9af157b8c5ad8e615fb3455e1b3583a4a481aa94d46433b5bfcd8ecf76ddd
export CELO_RPC_URL=https://forno.celo.org
```

---

## Step 2: Verify Contract Compiles

```bash
forge build --root contracts
```

**Expected Output**:
```
Compiling 1 files with Solc 0.8.28
Solc 0.8.28 finished in X.XXs
Compiler run successful!
```

---

## Step 3: Deploy to Celo Mainnet

```bash
forge script contracts/script/Deploy.s.sol:DeployProcurement \
  --rpc-url $CELO_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

**What happens**:
1. Script compiles
2. Simulates deployment
3. Asks for confirmation
4. Deploys contract
5. Outputs contract address

**Expected Output**:
```
Simulations:
  [PASS] DeployProcurement

Transactions saved to: broadcast/Deploy.s.sol/42220/run-latest.json

============================ DEPLOYMENT SUMMARY ============================
Deploying contracts with the account: 0x...
Deployed to: 0x... (ProcurementV2 contract address)
```

---

## Step 4: Save the Contract Address

Copy the deployed contract address from the output:
```
Deployed to: 0x1234567890123456789012345678901234567890
```

---

## Step 5: Verify on Celo Explorer

1. Go to https://explorer.celo.org
2. Search for your contract address
3. Click "Verify & Publish"
4. Upload source code from `contracts/src/core/ProcurementV2.sol`

---

## Step 6: Update Frontend

### Update `frontend/src/wagmiAbi.ts`:
```typescript
export const PROCUREMENT_ADDRESS = "0x1234567890123456789012345678901234567890";
```

### Update `frontend/.env.local`:
```
VITE_PROCUREMENT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_TOKEN_ADDRESS=0x765dE816845861e75a25FCA122BB6Caa78443cB5
```

---

## Step 7: Test the Deployment

### Option A: Using Cast (CLI)
```bash
# Check contract code exists
cast code --rpc-url https://forno.celo.org 0x1234567890123456789012345678901234567890

# Call owner function
cast call --rpc-url https://forno.celo.org \
  0x1234567890123456789012345678901234567890 \
  "owner()(address)"
```

### Option B: Using Frontend
1. Start frontend: `npm run dev`
2. Connect wallet
3. Try creating a project
4. Check transaction on explorer

---

## Troubleshooting

### Error: "Insufficient balance"
**Solution**: Add CELO to your account for gas fees
- Need ~0.5-1 CELO for deployment

### Error: "Invalid token address"
**Solution**: Token address is correct: `0x765dE816845861e75a25FCA122BB6Caa78443cB5`

### Error: "Transaction reverted"
**Solution**: 
1. Check private key is correct
2. Verify account has CELO
3. Check RPC URL is working

### Deployment hangs
**Solution**: 
1. Press Ctrl+C to cancel
2. Check internet connection
3. Try again with `--broadcast` flag

---

## Deployment Checklist

- [ ] Private key set in environment
- [ ] RPC URL set to Celo Mainnet
- [ ] Contract compiles successfully
- [ ] Account has CELO for gas
- [ ] Deployment script runs
- [ ] Contract address saved
- [ ] Contract verified on explorer
- [ ] Frontend updated with address
- [ ] Frontend tested

---

## What Gets Deployed

**Contract**: ProcurementV2
**Features**:
- Project creation & management
- Milestone workflow
- Payment release mechanism
- Reputation system
- Verification system
- Penalty system

**Token**: cUSD (0x765dE816845861e75a25FCA122BB6Caa78443cB5)

---

## After Deployment

### 1. Verify Contract
```bash
# Check it's deployed
curl https://explorer.celo.org/api/v2/smart-contracts/0x1234567890123456789012345678901234567890
```

### 2. Test Basic Functions
```bash
# Create a project (requires token approval first)
cast send --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  0x1234567890123456789012345678901234567890 \
  "createProject(string,uint256,address,uint256,uint256)" \
  "Test Project" \
  "1000000000000000000" \
  "0x2222222222222222222222222222222222222222" \
  $(date +%s) \
  $(($(date +%s) + 2592000))
```

### 3. Monitor Events
```bash
# Watch for ProjectCreated events
cast logs --rpc-url https://forno.celo.org \
  --address 0x1234567890123456789012345678901234567890 \
  --from-block 0
```

---

## Gas Costs

| Operation | Gas | Cost (at 0.5 gwei) |
|-----------|-----|-------------------|
| Deploy | ~2.5M | ~1.25 CELO |
| Create Project | ~150K | ~0.075 CELO |
| Create Milestone | ~120K | ~0.06 CELO |
| Rate Contractor | ~100K | ~0.05 CELO |

---

## Support

### Documentation
- Full guide: [DEPLOYMENT_GUIDE_V2.md](contracts/DEPLOYMENT_GUIDE_V2.md)
- Interactions: [INTERACTION_GUIDE.md](INTERACTION_GUIDE.md)
- Troubleshooting: [DEPLOYMENT_GUIDE_V2.md](contracts/DEPLOYMENT_GUIDE_V2.md#troubleshooting)

### Resources
- Celo Docs: https://docs.celo.org
- Forge Docs: https://book.getfoundry.sh
- Celo Explorer: https://explorer.celo.org

---

## Quick Command Reference

```bash
# Set environment
export PRIVATE_KEY=your_key
export CELO_RPC_URL=https://forno.celo.org

# Compile
forge build --root contracts

# Deploy
forge script contracts/script/Deploy.s.sol:DeployProcurement \
  --rpc-url $CELO_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Verify
cast code --rpc-url $CELO_RPC_URL 0x...

# Check owner
cast call --rpc-url $CELO_RPC_URL 0x... "owner()(address)"
```

---

**Ready to deploy? Follow the steps above!**

Last Updated: December 12, 2025
