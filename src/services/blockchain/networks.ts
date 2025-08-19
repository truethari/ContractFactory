import { isGanache, RPC_URL } from "@/config";

import type { AppKitNetwork } from "@reown/appkit-common";

export const hyperevmMainnet = {
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

export const ganacheLocal = {
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

export let NETWORKS: Record<string, AppKitNetwork> = {
  hyperliquid: hyperevmMainnet,
};

if (isGanache) {
  NETWORKS = {
    ...NETWORKS,
    ganache: ganacheLocal,
  };
}

export const getNetworkByChainId = (
  chainId: number,
): AppKitNetwork | undefined => {
  return Object.values(NETWORKS).find((network) => network.id === chainId);
};

export const getNetworkById = (
  networkId: string,
): AppKitNetwork | undefined => {
  return NETWORKS[networkId];
};

export const getExplorerUrlPath = (chainId: number): string | undefined => {
  try {
    const network = getNetworkByChainId(chainId);
    if (network && network.blockExplorers?.default) {
      return network.blockExplorers.default.url;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting explorer URL path:", error);
    return undefined;
  }
};

export const getChainImage = (chainId: number): string => {
  const images: Record<string, string> = {
    999: "/img/chains/Hyperliquid.png",
    1337: "/img/chains/Ganache.png",
  };

  return images[chainId] || "/img/chains/default.png";
};
