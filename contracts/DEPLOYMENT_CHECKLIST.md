# Tswift Mainnet Deployment Checklist

Complete this checklist to deploy Tswift to Celo and Base mainnet.

## Pre-Deployment

- [ ] Contract code is final and tested
- [ ] All tests pass: `forge test`
- [ ] Private key is secure and backed up
- [ ] You have sufficient funds for gas fees
- [ ] `.env` file is created and NOT committed to git
- [ ] You understand the deployment process

## Token Deployment (Deploy First!)

### Celo Mainnet Token

- [ ] Run token deployment script for Celo
- [ ] Save token address: `0x...`
- [ ] Verify token on Celo Explorer
- [ ] Confirm token supply: 1,000,000 TSWIFT

### Base Mainnet Token

- [ ] Run token deployment script for Base
- [ ] Save token address: `0x...`
- [ ] Verify token on BaseScan
- [ ] Confirm token supply: 1,000,000 TSWIFT

## Procurement Contract Deployment

### Celo Mainnet Procurement

- [ ] Update `.env` with Celo token address
- [ ] Run Procurement deployment script for Celo
- [ ] Save contract address: `0x...`
- [ ] Verify contract on Celo Explorer
- [ ] Test contract functions on Celo

### Base Mainnet Procurement

- [ ] Update `.env` with Base token address
- [ ] Run Procurement deployment script for Base
- [ ] Save contract address: `0x...`
- [ ] Verify contract on BaseScan
- [ ] Test contract functions on Base

## Frontend Configuration

- [ ] Update `frontend/.env.local` with all addresses
- [ ] Update `frontend/src/wagmi.ts` with mainnet chains
- [ ] Update `frontend/src/lib/wagmiContractConfig.ts` with addresses
- [ ] Update ABI if contract interface changed
- [ ] Test frontend with mainnet contracts

## Post-Deployment

- [ ] Document all deployment addresses
- [ ] Create backup of deployment records
- [ ] Update project documentation
- [ ] Announce deployment to users
- [ ] Monitor contract activity
- [ ] Keep private key secure

## Deployment Addresses

### Celo Mainnet
- Token: `0x...`
- Procurement: `0x...`
- Deployment Date: 
- Deployer: 

### Base Mainnet
- Token: `0x...`
- Procurement: `0x...`
- Deployment Date: 
- Deployer: 

## Quick Reference Commands

### Deploy Token to Celo
```bash
forge script script/DeployToken.s.sol:DeployToken \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.celo.org/api \
  -vvv
```

### Deploy Token to Base
```bash
forge script script/DeployToken.s.sol:DeployToken \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://basescan.org/api \
  -vvv
```

### Deploy Procurement to Celo
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.celo.org/api \
  -vvv
```

### Deploy Procurement to Base
```bash
forge script script/Deploy.s.sol:DeployProcurement \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://basescan.org/api \
  -vvv
```

## Important Notes

1. Deploy token FIRST, then use its address for Procurement
2. Deploy to Celo first, then Base (or vice versa)
3. Verify each contract immediately after deployment
4. Keep all addresses and ABIs in a secure location
5. Never share your private key
6. Test thoroughly before announcing to users
