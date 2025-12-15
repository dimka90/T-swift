#!/bin/bash

# Celo Mainnet Deployment Script for ProcurementV2

echo "🚀 Deploying ProcurementV2 to Celo Mainnet..."
echo ""

# Configuration
PRIVATE_KEY="f8b9af157b8c5ad8e615fb3455e1b3583a4a481aa94d46433b5bfcd8ecf76ddd"
RPC_URL="https://forno.celo.org"
TOKEN_ADDRESS="0x765dE816845861e75a25FCA122BB6Caa78443cB5"  # cUSD on Celo

echo "📋 Configuration:"
echo "  Network: Celo Mainnet"
echo "  RPC: $RPC_URL"
echo "  Token: $TOKEN_ADDRESS (cUSD)"
echo ""

# Get bytecode
echo "📦 Getting contract bytecode..."
BYTECODE=$(cat contracts/out/ProcurementV2.sol/ProcurementV2.json | jq -r '.bytecode.object')

if [ -z "$BYTECODE" ]; then
    echo "❌ Error: Could not get bytecode"
    exit 1
fi

echo "✅ Bytecode retrieved ($(echo $BYTECODE | wc -c) bytes)"
echo ""

# Encode constructor arguments
echo "🔧 Encoding constructor arguments..."
# Constructor takes address tokenAddress
CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" "$TOKEN_ADDRESS" 2>&1 | tr -d '\n')
echo "✅ Constructor args encoded"
echo ""

# Combine bytecode with constructor args (remove 0x prefix from constructor args)
CONSTRUCTOR_CLEAN=$(echo "$CONSTRUCTOR_ARGS" | sed 's/^0x//')
DEPLOY_DATA="0x${BYTECODE}${CONSTRUCTOR_CLEAN}"

echo "📤 Deploying contract..."
echo "  Sending transaction to Celo Mainnet..."
echo ""

# Deploy using cast send
DEPLOY_TX=$(cast send --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --create "$DEPLOY_DATA" \
  2>&1)

echo "$DEPLOY_TX"
echo ""

# Extract contract address from output
CONTRACT_ADDRESS=$(echo "$DEPLOY_TX" | grep -oP '0x[a-fA-F0-9]{40}' | tail -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Deployment failed or contract address not found"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo "🔗 Verify at: https://explorer.celo.org/mainnet/address/$CONTRACT_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Verify contract on Celo Explorer"
echo "2. Complete Self.xyz verification"
echo "3. Email builders@celo.org for Verified Builder status"
echo ""
echo "🎉 You're back in the game!"
