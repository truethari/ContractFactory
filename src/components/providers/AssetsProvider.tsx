"use client";

import { toast } from "sonner";
import { ethers } from "ethers";
import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import {
  useAppKit,
  useDisconnect,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";

import { RPC_URL } from "@/config";
import { readJWT } from "@/lib/jwt";
import { isAddressSame } from "@/utils/ethers";
import { getCurrentTimestamp } from "@/utils/timestamp";
import { getCookie, deleteCookie } from "@/utils/cookies";

import type { AppKitNetwork } from "@reown/appkit-common";
import type { Eip1193Provider, JsonRpcProvider, BrowserProvider } from "ethers";

interface ContextValues {
  walletAddress: string | null;
  isWalletConnected: boolean;
  walletProvider: BrowserProvider | JsonRpcProvider;
  openWalletModal: () => void;
  disconnectWallet: () => void;
  switchNetwork: (network: AppKitNetwork) => Promise<void>;

  signMessage: (message: string) => Promise<{
    success: boolean;
    message: string;
    signature: string | undefined;
  }>;

  copyToClipboard: (text: string) => Promise<void>;

  isLoggedIn: boolean;
  refreshLoginStatus: () => void;
}

const AssetsContext = createContext({} as ContextValues);

export default function AssetsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ========================= reown =========================
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider("eip155");
  const {
    status: reownStatus,
    address: reownAddress,
    isConnected: isReownConnected,
  } = useAppKitAccount();
  const { switchNetwork } = useAppKitNetwork();
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refreshLoginStatus = () => {
    if (reownStatus === "connecting") return;

    try {
      if (!isReownConnected || !reownAddress) {
        deleteCookie("jwtToken");
        return;
      }

      const jwtToken = getCookie("jwtToken");
      if (!jwtToken) {
        setIsLoggedIn(false);
        return;
      }

      const jwtValue = readJWT(jwtToken);
      if (
        !jwtValue ||
        jwtValue.isExpired ||
        !isAddressSame(jwtValue.address, reownAddress)
      ) {
        deleteCookie("jwtToken");
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error reading JWT:", error);
      deleteCookie("jwtToken");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    refreshLoginStatus();
  }, [isReownConnected, reownAddress, reownStatus]);

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

  const signMessage = async (
    message: string,
  ): Promise<{
    success: boolean;
    message: string;
    signature: string | undefined;
  }> => {
    if (!walletProvider || !isReownConnected) {
      toast.error("Please connect your wallet first");
      await open();
      return { success: false, message, signature: undefined };
    }

    try {
      const signer = await provider.getSigner();

      const payload = {
        message,
        timestamp: getCurrentTimestamp(),
      };

      const signature = await signer.signMessage(JSON.stringify(payload));
      return { success: true, message: JSON.stringify(payload), signature };
    } catch (error) {
      console.error(error);
      return { success: false, message, signature: undefined };
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

    signMessage,

    copyToClipboard,

    isLoggedIn,
    refreshLoginStatus,
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
