import { ethers } from "ethers";

export interface DeploymentState {
  // Contract selection and inputs
  selectedContract: string;
  contractInputs: Record<string, string>;

  // Compilation state
  isCompiling: boolean;
  compilationResult: CompilationResult | null;

  // Deployment state
  isDeploying: boolean;
  deploymentResult: DeploymentResult | null;

  // Network and wallet
  selectedChainId: number;
  selectedNetwork: string;
  walletConnected: boolean;

  // Gas settings
  gasSettings: GasSettings;
}

export interface CompilationResult {
  success: boolean;
  bytecode?: string;
  abi?: string;
  errors?: string[];
  warnings?: string[];
}

export interface CompilerInput {
  contractName: string;
  sourceCode: string;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

export interface DeploymentParams {
  bytecode: string;
  abi: string;
  networkId: string;
  signer: ethers.Signer;
  constructorArgs?: string[];
}

export interface GasSettings {
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  estimatedCost?: string;
}

export interface GasEstimation {
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost?: string;
  error?: string;
}

export interface CompilationRequest {
  contractName: string;
  sourceCode: string;
}
