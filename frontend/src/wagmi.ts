import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const lisk = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  network: 'lisk-testnet',
  nativeCurrency: {
    name: 'Lisk',
    symbol: 'LSK',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com/'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com/'],
    },
  },
  blockExplorers: {
    default: { name: 'Lisk Explorer', url: 'https://sepolia-blockscout.lisk.com/' },
  },
  testnet: true,
};

// Get your own Project ID from https://dashboard.reown.com/
const projectId = (import.meta.env.VITE_APPKIT_PROJECT_ID as string) || '';

const metadata = {
  name: 'Tswift',
  description: 'Decentralized Procurement Management System',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, polygon, optimism, arbitrum, base, sepolia, lisk];

const wagmiAdapter = new WagmiAdapter({
  networks: chains as any,
  projectId,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: chains as any,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export const config = wagmiAdapter.wagmiConfig;
