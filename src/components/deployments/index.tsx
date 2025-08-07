"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

import { useAssets } from "@/components/providers/AssetsProvider";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { AVAILABLE_CONTRACTS } from "@/contracts";

import { compileContract } from "@/services/api/compiler";
import { deployContract } from "@/services/blockchain/deployer";
import { NETWORKS, getExplorerUrlPath } from "@/services/blockchain/networks";

import type { DeploymentState } from "@/types";

export default function Deployments() {
  const { isWalletConnected, openWalletModal, walletProvider, switchNetwork } =
    useAssets();

  const [deploymentState, setDeploymentState] = useState<DeploymentState>({
    selectedContract: "",
    contractInputs: {},
    isCompiling: false,
    compilationResult: null,
    isDeploying: false,
    deploymentResult: null,
    selectedChainId: 999,
    selectedNetwork: "hyperliquid",
    walletConnected: isWalletConnected,
    gasSettings: {},
  });

  useEffect(() => {
    const chain = Object.values(NETWORKS).find(
      (network) => network.id === deploymentState.selectedChainId,
    );
    if (!chain) {
      console.error(
        "Invalid chain ID in deployment state:",
        deploymentState.selectedChainId,
      );
      return;
    }
    switchNetwork(chain);
  }, [deploymentState]);

  const currentContract = useMemo(() => {
    return AVAILABLE_CONTRACTS.find(
      (contract) => contract.name === deploymentState.selectedContract,
    );
  }, [deploymentState.selectedContract]);

  const handleInputChange = (inputName: string, value: string) => {
    setDeploymentState((prev) => ({
      ...prev,
      contractInputs: {
        ...prev.contractInputs,
        [inputName]: value,
      },
    }));
  };

  const handleContractChange = (contractName: string) => {
    setDeploymentState((prev) => ({
      ...prev,
      selectedContract: contractName,
      contractInputs: {},
      compilationResult: null,
      deploymentResult: null,
    }));
  };

  const handleNetworkChange = (chainId: string) => {
    const networkId = Object.keys(NETWORKS).find(
      (id) => NETWORKS[id].id === Number(chainId),
    );
    if (!networkId) {
      console.error("Invalid network ID:", chainId);
      return;
    }

    setDeploymentState((prev) => ({
      ...prev,
      selectedChainId: Number(chainId),
      selectedNetwork: networkId,
      deploymentResult: null,
    }));
  };

  const getPreviewCode = useCallback(() => {
    if (!currentContract) return "";

    let code = currentContract.code;

    try {
      currentContract.inputs.forEach((input) => {
        const value =
          deploymentState.contractInputs[input.name] || input.replaceWith;
        code = code.replaceAll(input.replaceWith, value);
      });
    } catch (error) {
      console.error("Error generating preview:", error);
    }

    return code;
  }, [currentContract, deploymentState.contractInputs]);

  const handleCompileAndDeploy = async () => {
    if (!currentContract || !walletProvider || !isWalletConnected) {
      return;
    }

    try {
      // Step 1: Compile
      setDeploymentState((prev) => ({
        ...prev,
        isCompiling: true,
        compilationResult: null,
        deploymentResult: null,
      }));

      const sourceCode = getPreviewCode();

      // Extract the actual contract name from the processed source code
      const contractNameMatch = sourceCode.match(/contract\s+(\w+)\s+is/);
      const actualContractName = contractNameMatch
        ? contractNameMatch[1]
        : currentContract.name;

      const compilationResult = await compileContract({
        contractName: actualContractName,
        sourceCode,
      });

      setDeploymentState((prev) => ({
        ...prev,
        isCompiling: false,
        compilationResult,
      }));

      if (!compilationResult.success || !compilationResult.bytecode) {
        return;
      }

      // Step 2: Deploy
      setDeploymentState((prev) => ({
        ...prev,
        isDeploying: true,
      }));

      const signerInstance = await walletProvider.getSigner();

      const deploymentResult = await deployContract({
        bytecode: compilationResult.bytecode,
        abi: compilationResult.abi! as string,
        networkId: deploymentState.selectedNetwork,
        signer: signerInstance,
      });

      setDeploymentState((prev) => ({
        ...prev,
        isDeploying: false,
        deploymentResult,
      }));
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentState((prev) => ({
        ...prev,
        isCompiling: false,
        isDeploying: false,
        deploymentResult: {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      }));
    }
  };

  const isFormValid =
    currentContract &&
    currentContract.inputs.every(
      (input) => deploymentState.contractInputs[input.name],
    ) &&
    isWalletConnected;

  const isLoading = deploymentState.isCompiling || deploymentState.isDeploying;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Contract Deployment</h1>
          <p className="mt-2 text-gray-400">
            Select a contract template and configure its parameters
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">
                Contract Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contract-select" className="text-gray-300">
                  Select Contract Type
                </Label>
                <Select onValueChange={handleContractChange}>
                  <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                    <SelectValue placeholder="Choose a contract template" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {AVAILABLE_CONTRACTS.map((contract) => (
                      <SelectItem
                        key={contract.name}
                        value={contract.name}
                        className="text-white focus:bg-gray-700"
                      >
                        <div className="font-medium">{contract.name}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="network-select" className="text-gray-300">
                  Select Network
                </Label>
                <Select
                  value={deploymentState.selectedChainId.toString()}
                  onValueChange={handleNetworkChange}
                >
                  <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                    <SelectValue placeholder="Choose a network" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {Object.entries(NETWORKS).map(([networkId, network]) => (
                      <SelectItem
                        key={networkId}
                        value={network.id.toString()}
                        className="text-white focus:bg-gray-700"
                      >
                        <div className="font-medium">{network.name}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentContract && (
                <div className="space-y-4">
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Contract Parameters
                    </h3>
                    <div className="space-y-4">
                      {currentContract.inputs.map((input) => (
                        <div key={input.name} className="space-y-2">
                          <Label htmlFor={input.name} className="text-gray-300">
                            {input.name}{" "}
                            <span className="text-sm text-gray-500">
                              ({input.type})
                            </span>
                          </Label>
                          <Input
                            id={input.name}
                            type={
                              input.type === "uint256" || input.type === "uint8"
                                ? "number"
                                : "text"
                            }
                            placeholder={`Enter ${input.name.toLowerCase()}`}
                            value={
                              deploymentState.contractInputs[input.name] || ""
                            }
                            onChange={(e) =>
                              handleInputChange(input.name, e.target.value)
                            }
                            className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    {!isWalletConnected ? (
                      <div className="text-center">
                        <p className="mb-4 text-sm text-gray-400">
                          Please connect your wallet to deploy contracts
                        </p>
                        <Button
                          onClick={openWalletModal}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Connect Wallet
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(deploymentState.compilationResult?.errors?.length ??
                          0) > 0 && (
                          <div className="rounded-lg border border-red-800 bg-red-900/20 p-3">
                            <h4 className="mb-2 text-sm font-medium text-red-400">
                              Compilation Errors:
                            </h4>
                            {deploymentState.compilationResult?.errors?.map(
                              (error, index) => (
                                <p key={index} className="text-xs text-red-300">
                                  {error}
                                </p>
                              ),
                            )}
                          </div>
                        )}

                        {deploymentState.deploymentResult?.error && (
                          <div className="rounded-lg border border-red-800 bg-red-900/20 p-3">
                            <h4 className="mb-2 text-sm font-medium text-red-400">
                              Deployment Error:
                            </h4>
                            <p className="text-xs text-red-300">
                              {deploymentState.deploymentResult.error}
                            </p>
                          </div>
                        )}

                        {deploymentState.deploymentResult?.success && (
                          <div className="rounded-lg border border-green-800 bg-green-900/20 p-3">
                            <h4 className="mb-2 text-sm font-medium text-green-400">
                              Deployment Successful!
                            </h4>
                            <div className="space-y-2 text-xs text-green-300">
                              <p>
                                <strong>Contract Address:</strong>{" "}
                                {
                                  deploymentState.deploymentResult
                                    .contractAddress
                                }
                              </p>
                              <p>
                                <strong>Transaction Hash:</strong>{" "}
                                {
                                  deploymentState.deploymentResult
                                    .transactionHash
                                }
                              </p>
                              {deploymentState.selectedNetwork && (
                                <a
                                  href={`${getExplorerUrlPath(deploymentState.selectedChainId)}/address/${deploymentState.deploymentResult.contractAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-blue-400 hover:text-blue-300"
                                >
                                  View on Block Explorer →
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {isLoading && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">
                                {deploymentState.isCompiling
                                  ? "Compiling contract..."
                                  : "Deploying contract..."}
                              </span>
                            </div>
                            <Progress
                              value={
                                deploymentState.isCompiling
                                  ? 33
                                  : deploymentState.isDeploying
                                    ? 66
                                    : 100
                              }
                              className="h-2"
                            />
                          </div>
                        )}

                        <Button
                          onClick={handleCompileAndDeploy}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600"
                          disabled={!isFormValid || isLoading}
                        >
                          {isLoading
                            ? deploymentState.isCompiling
                              ? "Compiling..."
                              : "Deploying..."
                            : "Compile & Deploy Contract"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">
                Contract Preview & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentContract ? (
                <div className="space-y-4">
                  {deploymentState.compilationResult && (
                    <div className="rounded-lg bg-gray-800 p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">
                          Compilation Status
                        </h4>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            deploymentState.compilationResult.success
                              ? "border border-green-800 bg-green-900/20 text-green-400"
                              : "border border-red-800 bg-red-900/20 text-red-400"
                          }`}
                        >
                          {deploymentState.compilationResult.success
                            ? "Success"
                            : "Failed"}
                        </span>
                      </div>
                      {deploymentState.compilationResult.warnings &&
                        deploymentState.compilationResult.warnings.length >
                          0 && (
                          <div className="text-xs text-yellow-400">
                            {deploymentState.compilationResult.warnings.length}{" "}
                            warning(s)
                          </div>
                        )}
                    </div>
                  )}

                  <div className="rounded-lg bg-gray-950 p-4">
                    <pre className="max-h-96 overflow-auto text-sm text-gray-300">
                      <code>{getPreviewCode()}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-950">
                  <p className="text-gray-500">
                    Select a contract to see the preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
