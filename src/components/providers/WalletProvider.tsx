"use client";

import React from "react";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

import { isGanache, RPC_URL } from "@/config";

import type { AppKitNetwork } from "@reown/appkit-common";

const projectId = "124231be92c2ac6686e0ef0110c2381c";

const metadata = {
  name: "Contract Factory",
  description: "Contract Factory",
  url: "https://172.0.0.1.com",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const hyperevmMainnet = {
  id: 999,
  caipNetworkId: "eip155:999",
  chainNamespace: "eip155",
  name: "Hyperliquid",
  nativeCurrency: {
    decimals: 18,
    name: "HYPE",
    symbol: "HYPE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.hyperliquid.xyz/evm"],
      webSocket: ["wss://api.hyperliquid.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://hyperliquid.cloud.blockscout.com",
    },
  },
} as const;

// Ganache local network configuration
const ganacheLocal = {
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Ganache Explorer",
      url: "http://localhost:8545",
    },
  },
  testnet: true,
} as const;

const networks = isGanache ? [ganacheLocal] : [hyperevmMainnet];

// Log the network configuration
console.log(
  `🌐 Wallet Provider configured for: ${isGanache ? "Ganache Network" : "Hyperliquid Mainnet"}`,
);
if (isGanache) {
  console.log(`🔧 Using Ganache local node at ${RPC_URL}`);
  console.log("⚠️  Make sure your Ganache node is running on port 8545");
}

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: networks as unknown as [AppKitNetwork, ...AppKitNetwork[]],
  projectId,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
  defaultNetwork: isGanache ? (ganacheLocal as AppKitNetwork) : hyperevmMainnet,
});

export default function Web3Modal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Show network info in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const isGanache = process.env.NEXT_PUBLIC_IS_GANACHE === "true";
      if (isGanache) {
        console.log("🚀 Ganache Network Details:");
        console.log("  - Chain ID: 1337");
        console.log(`  - RPC URL: ${RPC_URL}`);
        console.log("  - Import test accounts to your wallet");
      }
    }
  }, []);

  return children;
}
