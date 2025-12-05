# Tswift Token (ERC20) Deployment Guide

This guide explains how to deploy the Tswift ERC20 token to Celo and Base **mainnet** blockchains.

## Overview

The Tswift Token is an ERC20 token used for:
- Project funding in the Procurement system
- Payment processing for milestones
- Contractor compensation

**Token Details:**
- Name: Tswift Token
- Symbol: TSWIFT
- Decimals: 18
- Initial Supply: 1,000,000 TSWIFT
- Features: Burnable, Mintable (owner only)

## Prerequisites

1. **Foundry installed** - [Installation guide](https://book.getfoundry.sh/getting-started/installation)
2. **Private key** - Your wallet's private key (keep it EXTREMELY secure!)
3. **Mainnet funds** - Real ETH/CELO for gas fees on mainnet
4. **Sufficient balance** - At least 0.1 ETH or 1 CELO for deployment

## Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your mainnet values:
```bash
PRIVATE_KEY=your_private_key_here
```

## Deployment Order

**IMPORTANT:** Deploy the token FIRST, then use its address for the Procurement contract deployment.

### Step 1: Deploy Token to Celo Mainnet

```bash
forge script script/DeployToken.s.sol:DeployToken \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.celo.org/api \
  -vvv
```

**Save the token address from the output:**
```
TswiftToken deployed at: 0x...
```

### Step 2: Verify Token on Celo Explorer

Visit: https://explorer.celo.org/

Search for your token contract address to verify deployment.

### Step 3: Deploy Token to Base Mainnet

```bash
forge script script/DeployToken.s.sol:DeployToken \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://basescan.org/api \
  -vvv
```

**Save the token address from the output:**
```
TswiftToken deployed at: 0x...
```

### Step 4: Verify Token on BaseScan

Visit: https://basescan.org/

Search for your token contract address to verify deployment.

## Next Steps: Deploy Procurement Contract

After deploying the token, use the token addresses to deploy the Procurement contract:

1. Update `.env` with token addresses:
```bash
# Celo Mainnet
CELO_TOKEN_ADDRESS=0x...

# Base Mainnet
BASE_TOKEN_ADDRESS=0x...
```

2. Deploy Procurement contract to Celo:
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.celo.org/api \
  -vvv
```

3. Deploy Procurement contract to Base:
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://basescan.org/api \
  -vvv
```

## Token Contract Addresses

After successful deployment, save your token addresses:

### Celo Mainnet
- **Token Contract**: `0x...`
- **Deployment TX**: `0x...`
- **Deployer Address**: `0x...`

### Base Mainnet
- **Token Contract**: `0x...`
- **Deployment TX**: `0x...`
- **Deployer Address**: `0x...`

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

## Gas Fee Estimates

### Celo Mainnet
- Token deployment: ~1.5-2 million gas
- Gas price: ~1-5 gwei
- Estimated cost: $0.30 - $2 USD

### Base Mainnet
- Token deployment: ~1.5-2 million gas
- Gas price: ~0.1-1 gwei
- Estimated cost: $0.05 - $0.50 USD

## Token Features

### Minting
Only the contract owner can mint new tokens:
```solidity
token.mint(address, amount);
```

### Burning
Anyone can burn their own tokens:
```solidity
token.burn(amount);
```

Or burn from another address (with approval):
```solidity
token.burnFrom(address, amount);
```

## Updating Frontend Configuration

After deploying both token and Procurement contracts:

1. Update `frontend/.env.local`:
```
VITE_CELO_TOKEN_ADDRESS=0x...
VITE_CELO_PROCUREMENT_ADDRESS=0x...
VITE_BASE_TOKEN_ADDRESS=0x...
VITE_BASE_PROCUREMENT_ADDRESS=0x...
```

2. Update `frontend/src/wagmi.ts` with contract addresses

3. Update `frontend/src/lib/wagmiContractConfig.ts` with both token and procurement addresses

## Critical Security Notes

1. **NEVER commit `.env` file** - It contains your private key
2. **Use a dedicated deployment wallet** - Don't use your main wallet
3. **Test on testnet first** - Always deploy to testnet before mainnet
4. **Verify contracts immediately** - Verify on block explorer after deployment
5. **Keep secure backups** - Save all deployment addresses and ABIs
6. **Use hardware wallet if possible** - For production deployments
7. **Double-check all addresses** - Verify all addresses before deployment
8. **Monitor gas prices** - Deploy during low gas periods if possible
9. **Keep deployment records** - Document all deployments with timestamps
10. **Consider professional audit** - Audit before mainnet deployment

## Troubleshooting

### "Insufficient funds" error
- Ensure you have enough native tokens for gas fees
- Celo: Need CELO tokens
- Base: Need ETH tokens

### "Invalid private key" error
- Ensure your private key is in the `.env` file
- Don't include "0x" prefix
- Private key should be 64 hex characters

### Verification failed
- Wait a few blocks before verification
- Ensure compiler version matches (0.8.26)
- Check that constructor arguments are correct

## Support

For issues or questions:
- Celo Docs: https://docs.celo.org
- Base Docs: https://docs.base.org
- Foundry Book: https://book.getfoundry.sh
- OpenZeppelin Docs: https://docs.openzeppelin.com
