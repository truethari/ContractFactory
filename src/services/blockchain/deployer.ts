import { ethers } from "ethers";
import { getNetworkById } from "./networks";

import type { DeploymentResult, DeploymentParams } from "@/types";

export async function deployContract({
  bytecode,
  abi,
  networkId,
  signer,
  constructorArgs = [],
}: DeploymentParams): Promise<DeploymentResult> {
  try {
    const network = getNetworkById(networkId);
    if (!network) {
      return {
        success: false,
        error: `Unknown network: ${networkId}`,
      };
    }

    const signerNetwork = await signer.provider?.getNetwork();
    if (!signerNetwork) {
      return {
        success: false,
        error: "Unable to detect network from wallet",
      };
    }

    if (Number(signerNetwork.chainId) !== network.id) {
      return {
        success: false,
        error: `Please switch to ${network.name} (Chain ID: ${network.id})`,
      };
    }

    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

    const deploymentTransaction = await contractFactory.deploy(
      ...constructorArgs,
    );

    const receipt = await deploymentTransaction.deploymentTransaction()?.wait();

    if (!receipt) {
      return {
        success: false,
        error: "Failed to get deployment receipt",
      };
    }

    return {
      success: true,
      contractAddress: await deploymentTransaction.getAddress(),
      transactionHash: receipt.hash,
    };
  } catch (error) {
    let errorMessage = "Deployment failed";

    if (error instanceof Error) {
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas fees";
      } else if (error.message.includes("gas")) {
        errorMessage = "Gas estimation failed - check contract validity";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function estimateDeploymentGas({
  bytecode,
  abi,
  signer,
  constructorArgs = [],
}: Omit<DeploymentParams, "networkId">): Promise<{
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost?: string;
  error?: string;
}> {
  try {
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

    const gasLimit = await contractFactory
      .getDeployTransaction(...constructorArgs)
      .then((tx) => signer.estimateGas(tx));

    const feeData = await signer.provider?.getFeeData();

    let estimatedCost = "0";
    if (feeData?.gasPrice && gasLimit) {
      estimatedCost = ethers.formatEther(feeData.gasPrice * gasLimit);
    } else if (feeData?.maxFeePerGas && gasLimit) {
      estimatedCost = ethers.formatEther(feeData.maxFeePerGas * gasLimit);
    }

    return {
      gasLimit,
      gasPrice: feeData?.gasPrice || undefined,
      maxFeePerGas: feeData?.maxFeePerGas || undefined,
      maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas || undefined,
      estimatedCost,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gas estimation failed",
    };
  }
}
