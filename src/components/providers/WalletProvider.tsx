"use client";

import React from "react";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

import { isGanache, RPC_URL } from "@/config";

import { hyperevmMainnet, ganacheLocal } from "@/services/blockchain/networks";

import type { AppKitNetwork } from "@reown/appkit-common";

const projectId = "d9c099801e27a49cfd9ea1f6bd88a379";

const metadata = {
  name: "Contract Factory",
  description: "Contract Factory",
  url: "https://contract-factory.tharindu.dev",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const networks = isGanache
  ? [ganacheLocal, hyperevmMainnet]
  : [hyperevmMainnet];

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
