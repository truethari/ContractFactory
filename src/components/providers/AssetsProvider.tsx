"use client";

import { ethers } from "ethers";
import React, { useMemo, useContext, createContext } from "react";
import {
  useAppKit,
  useDisconnect,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";

import { toast } from "sonner";
import { RPC_URL } from "@/config";

import type { AppKitNetwork } from "@reown/appkit-common";
import type { Eip1193Provider, JsonRpcProvider, BrowserProvider } from "ethers";

interface ContextValues {
  walletAddress: string | null;
  isWalletConnected: boolean;
  walletProvider: BrowserProvider | JsonRpcProvider;
  openWalletModal: () => void;
  disconnectWallet: () => void;
  switchNetwork: (network: AppKitNetwork) => Promise<void>;

  copyToClipboard: (text: string) => Promise<void>;
}

const AssetsContext = createContext({} as ContextValues);

export default function AssetsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ========================= reown =========================
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider("eip155");
  const { address: reownAddress, isConnected: isReownConnected } =
    useAppKitAccount();
  const { switchNetwork } = useAppKitNetwork();
  // =========================================================

  const provider: BrowserProvider | JsonRpcProvider = useMemo(() => {
    if (walletProvider)
      return new ethers.BrowserProvider(walletProvider as Eip1193Provider);
    else return new ethers.JsonRpcProvider(RPC_URL);
  }, [walletProvider]);

  const handleSwitchNetwork = async (network: AppKitNetwork) => {
    try {
      switchNetwork(network);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const ContextValues: ContextValues = {
    isWalletConnected: isReownConnected,
    walletAddress: reownAddress
      ? ethers.getAddress(reownAddress.toString().toLowerCase())
      : null,
    openWalletModal: () => open(),
    disconnectWallet: () => disconnect(),
    walletProvider: provider,
    switchNetwork: handleSwitchNetwork,

    copyToClipboard,
  };

  return (
    <AssetsContext.Provider value={ContextValues}>
      {children}
    </AssetsContext.Provider>
  );
}

export const useAssets = () => {
  return useContext(AssetsContext);
};
