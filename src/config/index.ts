import { ethers } from "ethers";

export const isGanache = process.env.NEXT_PUBLIC_IS_GANACHE === "true";

export const RPC_URL = isGanache
  ? "http://localhost:8545"
  : "https://rpc.hyperliquid.xyz/evm";

export const provider = new ethers.JsonRpcProvider(RPC_URL);
