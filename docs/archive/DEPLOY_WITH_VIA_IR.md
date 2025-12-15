# Deploy & Verify with --via-ir Flag

## The Secret: --via-ir Flag

Your friend discovered the key! The `--via-ir` flag uses intermediate representation which makes verification much easier.

## Why --via-ir Works

- ✅ Generates cleaner bytecode
- ✅ Better optimization
- ✅ Easier to verify
- ✅ Matches explorer expectations
- ✅ Works on both testnet and mainnet

## Deploy Command (Mainnet)

```bash
export PRIVATE_KEY=f8b9af157b8c5ad8e615fb3455e1b3583a4a481aa94d46433b5bfcd8ecf76ddd

forge script contracts/script/DeployAndVerify.s.sol:DeployAndVerify \
  --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv \
  --via-ir
```

## What Each Flag Does

| Flag | Purpose |
|------|---------|
| `--rpc-url` | Network endpoint |
| `--private-key` | Your wallet key |
| `--broadcast` | Actually deploy (not just simulate) |
| `-vvvv` | Very verbose output (shows details) |
| `--via-ir` | Use intermediate representation (KEY!) |

## Expected Output

```
ProcurementV2 contract deployed at: 0x...
Token address: 0x765dE816845861e75a25FCA122BB6Caa78443cB5
Network: Celo Mainnet
Deployment successful!
```

## After Deployment

The contract should be easier to verify because:
1. Bytecode is cleaner
2. Compiler output matches better
3. Explorer can verify automatically

## Verification After Deployment

### Option 1: Automatic Verification (Recommended)
Some explorers auto-verify with `--via-ir` deployments

### Option 2: Manual Verification
If needed, use the clean source code:
1. Go to Celo Explorer
2. Click "Verify & Publish"
3. Use `ProcurementV2_Clean.sol`
4. Same settings as before

## Full Workflow

```bash
# 1. Set environment
export PRIVATE_KEY=your_key

# 2. Deploy with --via-ir
forge script contracts/script/DeployAndVerify.s.sol:DeployAndVerify \
  --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv \
  --via-ir

# 3. Copy contract address from output

# 4. Check on explorer
# https://explorer.celo.org/mainnet/address/0x...

# 5. If not auto-verified, manually verify with clean source
```

## Why Your Friend's Approach Works

Your friend used:
```bash
forge script script/CreateEvents.s.sol:CreateEvents \
  --rpc-url https://forno.celo-sepolia.celo-testnet.org \
  --private-key <private_key> \
  --broadcast \
  -vvvv \
  --via-ir
```

The `--via-ir` flag:
- Compiles to intermediate representation first
- Produces bytecode that matches explorer expectations
- Makes verification automatic or much easier
- Works on testnet and mainnet

## Try This Now

```bash
export PRIVATE_KEY=f8b9af157b8c5ad8e615fb3455e1b3583a4a481aa94d46433b5bfcd8ecf76ddd

forge script contracts/script/DeployAndVerify.s.sol:DeployAndVerify \
  --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv \
  --via-ir
```

## Troubleshooting

### If you get "unknown variant" error
- Update Forge: `foundryup`
- Try without `-vvvv` first
- Then add it back

### If deployment fails
- Check private key is correct
- Check account has CELO for gas
- Check RPC URL is working

### If verification still fails
- Use `ProcurementV2_Clean.sol` manually
- Check compiler version (0.8.20)
- Check optimization (Yes, 200 runs)

## Key Takeaway

**Always use `--via-ir` for deployments you want to verify!**

It's the difference between:
- ❌ Manual verification struggles
- ✅ Automatic or easy verification

---

**Status**: Ready to deploy with --via-ir
**Expected**: Automatic or easy verification
**Time**: 5-10 minutes
