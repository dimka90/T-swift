# Tswift Smart Contract Deployment Guide - Mainnet

This guide explains how to deploy the Procurement smart contract to Celo and Base **mainnet** blockchains.

## ⚠️ IMPORTANT - Production Deployment Checklist

Before deploying to mainnet, ensure:
- [ ] Contract has been thoroughly tested on testnet
- [ ] All tests pass: `forge test`
- [ ] Contract is verified on testnet block explorer
- [ ] You have sufficient funds for gas fees (mainnet is expensive!)
- [ ] Private key is secure and never committed to git
- [ ] You have backups of deployment addresses and ABIs
- [ ] Contract code is final and audited if possible

## Prerequisites

1. **Foundry installed** - [Installation guide](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key (keep it EXTREMELY secure!)
3. **Mainnet funds** - Real ETH/CELO for gas fees on mainnet
4. **ERC20 token address** - Address of the token to use for payments on mainnet

## Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your mainnet values:
```bash
PRIVATE_KEY=your_private_key_here
TOKEN_ADDRESS=0x...  # Your mainnet ERC20 token address
```

## Deployment to Celo Mainnet

### Step 1: Deploy the contract
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.celo.org/api \
  -vvv
```

### Step 2: Verify on Celo Explorer
Visit: https://explorer.celo.org/

Search for your contract address to verify deployment and view transactions.

### Step 3: Save Contract Address
Save the deployed contract address for frontend configuration:
```
Celo Mainnet Procurement: 0x...
```

## Deployment to Base Mainnet

### Step 1: Deploy the contract
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://basescan.org/api \
  -vvv
```

### Step 2: Verify on BaseScan
Visit: https://basescan.org/

Search for your contract address to verify deployment and view transactions.

### Step 3: Save Contract Address
Save the deployed contract address for frontend configuration:
```
Base Mainnet Procurement: 0x...
```

## Mainnet Network Configuration

### Celo Mainnet
- **Chain ID**: 42220
- **RPC URL**: https://forno.celo.org
- **Explorer**: https://explorer.celo.org
- **Native Token**: CELO
- **Gas Token**: CELO

### Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **Native Token**: ETH
- **Gas Token**: ETH

## Gas Fee Estimates (Mainnet)

Deployment costs vary based on network congestion:

### Celo Mainnet
- Estimated gas: ~2-3 million gas
- Gas price: ~1-5 gwei
- Estimated cost: $0.50 - $5 USD

### Base Mainnet
- Estimated gas: ~2-3 million gas
- Gas price: ~0.1-1 gwei
- Estimated cost: $0.10 - $1 USD

## Updating Frontend Configuration

After deployment, update your frontend configuration:

1. Update `frontend/src/wagmi.ts` with the deployed contract addresses
2. Update `frontend/src/lib/wagmiContractConfig.ts` with the new contract addresses
3. Update the ABI if the contract interface changed

## Troubleshooting

### "Insufficient funds" error
- Get testnet funds from the faucet
- Celo: https://faucet.celo.org
- Base: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### "Invalid private key" error
- Ensure your private key is in the `.env` file
- Don't include "0x" prefix in the private key
- Keep your private key secure and never commit it

### Verification failed
- Ensure the contract source code matches the deployed bytecode
- Check that the constructor arguments are correct
- Verify the Solidity compiler version matches

## Mainnet Contract Addresses

After successful deployment, save your contract addresses and update the frontend:

### Celo Mainnet
- **Procurement Contract**: `0x...`
- **Deployment TX**: `0x...`
- **Deployer Address**: `0x...`

### Base Mainnet
- **Procurement Contract**: `0x...`
- **Deployment TX**: `0x...`
- **Deployer Address**: `0x...`

## Updating Frontend Configuration

After deployment to mainnet, update your frontend:

1. Update `frontend/src/wagmi.ts` to add mainnet chains:
```typescript
import { celo, base } from 'wagmi/chains';

const chains = [
  mainnet,
  celo,        // Celo Mainnet
  base,        // Base Mainnet
  // ... other chains
];
```

2. Update `frontend/src/lib/wagmiContractConfig.ts` with mainnet contract addresses:
```typescript
export const wagmiContractConfig = {
  address: {
    42220: '0x...', // Celo Mainnet
    8453: '0x...',  // Base Mainnet
  },
  abi: WagmiAbi,
};
```

3. Update environment variables in `frontend/.env.local`:
```
VITE_CELO_CONTRACT_ADDRESS=0x...
VITE_BASE_CONTRACT_ADDRESS=0x...
```

## Critical Security Notes for Mainnet Deployment

1. **NEVER commit `.env` file** - It contains your private key
2. **Use a dedicated deployment wallet** - Don't use your main wallet
3. **Test on testnet first** - Always deploy to testnet before mainnet
4. **Verify contracts immediately** - Verify on block explorer after deployment
5. **Keep secure backups** - Save deployment addresses, ABIs, and private keys securely
6. **Use hardware wallet if possible** - For production deployments
7. **Double-check all addresses** - Verify all addresses before deployment
8. **Monitor gas prices** - Deploy during low gas periods if possible
9. **Keep deployment records** - Document all deployments with timestamps and addresses
10. **Consider professional audit** - Audit the contract before mainnet deployment

## Mainnet Deployment Troubleshooting

### "Insufficient funds" error
- Ensure you have enough native tokens for gas fees
- Celo: Need CELO tokens
- Base: Need ETH tokens
- Check your wallet balance before deployment

### "Invalid private key" error
- Ensure your private key is in the `.env` file
- Don't include "0x" prefix in the private key
- Private key should be 64 hex characters

### "Transaction reverted" error
- Increase gas limit: `--gas-limit 5000000`
- Check token address is correct
- Ensure token contract exists on the network

### Verification failed
- Ensure the contract source code matches the deployed bytecode
- Check that the constructor arguments are correct
- Verify the Solidity compiler version matches (0.8.26)
- Wait a few blocks before verification

## Support

For issues or questions:
- Celo Docs: https://docs.celo.org
- Base Docs: https://docs.base.org
- Foundry Book: https://book.getfoundry.sh
