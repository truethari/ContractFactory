"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("Please install MetaMask or another Web3 wallet");
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setState({
        provider,
        signer,
        account,
        chainId: Number(network.chainId),
        isConnected: true,
        isConnecting: false,
      });

      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setState({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
    toast.info("Wallet disconnected");
  };

  const callReadFunction = async (
    contractAddress: string,
    abi: string,
    functionName: string,
    params: unknown[] = [],
  ) => {
    if (!state.provider) {
      throw new Error("No Web3 provider available");
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(abi),
        state.provider,
      );
      const result = await contract[functionName](...params);
      return result;
    } catch (error) {
      console.error("Read function call failed:", error);
      throw error;
    }
  };

  const callWriteFunction = async (
    contractAddress: string,
    abi: string,
    functionName: string,
    params: unknown[] = [],
    value?: string,
  ) => {
    if (!state.signer) {
      throw new Error("No signer available. Please connect your wallet.");
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(abi),
        state.signer,
      );

      const txOptions: { value?: bigint } = {};
      if (value && value !== "0") {
        txOptions.value = ethers.parseEther(value);
      }

      const tx = await contract[functionName](...params, txOptions);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Write function call failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();

            setState({
              provider,
              signer,
              account,
              chainId: Number(network.chainId),
              isConnected: true,
              isConnecting: false,
            });
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        const _accounts = accounts as string[];
        if (_accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    callReadFunction,
    callWriteFunction,
  };
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}
