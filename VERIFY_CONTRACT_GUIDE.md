# Verify ProcurementV2 Contract on Celo Explorer

## Contract Details

**Contract Address**: `0x8b21B2ae397436EBb1804131Cb34504Fe795EcD4`
**Network**: Celo Mainnet
**Compiler**: Solidity 0.8.20
**Optimization**: Yes (200 runs)

## Step-by-Step Verification

### Step 1: Go to Celo Explorer
1. Open: https://explorer.celo.org/mainnet/address/0x8b21B2ae397436EBb1804131Cb34504Fe795EcD4
2. Look for the "Code" tab
3. Click "Verify & Publish"

### Step 2: Select Verification Method
- Choose: **Solidity (Single file)**
- Compiler: **0.8.20**
- Optimization: **Yes**
- Optimization Runs: **200**

### Step 3: Upload Source Code

Copy the entire content of `contracts/src/core/ProcurementV2.sol` and paste it into the verification form.

**Important**: The contract imports other files. You have two options:

#### Option A: Flatten the Contract (Recommended)
Use Forge to flatten the contract:
```bash
forge flatten contracts/src/core/ProcurementV2.sol > ProcurementV2_Flattened.sol
```

Then copy the entire flattened file into the verification form.

#### Option B: Upload Individual Files
If the explorer supports multi-file verification:
1. Upload `contracts/src/core/ProcurementV2.sol`
2. Upload `contracts/src/types/Struct.sol`
3. Upload `contracts/src/types/Enum.sol`
4. Upload `contracts/src/interfaces/ITOKEN.sol`

### Step 4: Constructor Arguments

The constructor takes one argument:
```solidity
constructor(address _tokenAddress)
```

**Constructor Argument (ABI-encoded)**:
```
0x000000000000000000000000765de816845861e75a25fca122bb6caa78443cb5
```

This is the cUSD token address on Celo Mainnet.

### Step 5: Submit for Verification

1. Click "Verify & Publish"
2. Wait for verification (usually 1-5 minutes)
3. Once verified, you'll see a green checkmark

## Flattened Contract Method (Easiest)

Run this command to flatten the contract:

```bash
forge flatten contracts/src/core/ProcurementV2.sol > ProcurementV2_Flattened.sol
```

Then:
1. Open the flattened file
2. Copy all content
3. Paste into Celo Explorer verification form
4. Select Solidity 0.8.20
5. Set optimization to Yes (200 runs)
6. Add constructor arguments
7. Submit

## Verification Checklist

- [ ] Contract address correct: `0x8b21B2ae397436EBb1804131Cb34504Fe795EcD4`
- [ ] Network: Celo Mainnet
- [ ] Compiler: Solidity 0.8.20
- [ ] Optimization: Yes
- [ ] Optimization Runs: 200
- [ ] Source code pasted correctly
- [ ] Constructor arguments included
- [ ] License: MIT
- [ ] Submit verification

## What Happens After Verification

✅ Green checkmark on contract address
✅ Source code visible on explorer
✅ All functions readable
✅ Counts toward Celo Talent Protocol ranking
✅ Shows you're a legitimate builder

## Troubleshooting

### "Verification Failed"
- Check compiler version (must be 0.8.20)
- Check optimization settings
- Ensure constructor arguments are correct
- Try flattening the contract

### "Constructor Arguments Mismatch"
- Use: `0x000000000000000000000000765de816845861e75a25fca122bb6caa78443cb5`
- This is the cUSD token address

### "Source Code Doesn't Match"
- Make sure you're using the exact source code
- No extra spaces or formatting changes
- Use flattened version if having issues

## After Verification

1. **Share on Twitter**: "Just verified my ProcurementV2 contract on Celo! 🚀"
2. **Update GitHub**: Add contract address to README
3. **Next Step**: Complete Self.xyz verification
4. **Expected Impact**: Position #106 → #95-100

## Links

- **Contract**: https://explorer.celo.org/mainnet/address/0x8b21B2ae397436EBb1804131Cb34504Fe795EcD4
- **Celo Explorer**: https://explorer.celo.org
- **Forge Docs**: https://book.getfoundry.sh

## Quick Reference

| Item | Value |
|------|-------|
| Address | 0x8b21B2ae397436EBb1804131Cb34504Fe795EcD4 |
| Network | Celo Mainnet |
| Compiler | 0.8.20 |
| Optimization | Yes (200) |
| Constructor Args | 0x000000000000000000000000765de816845861e75a25fca122bb6caa78443cb5 |
| License | MIT |

---

**Status**: Ready to verify
**Time**: ~5 minutes
**Impact**: +10-15 ranking positions
