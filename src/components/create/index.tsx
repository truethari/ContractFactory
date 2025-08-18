"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Code,
  Sparkles,
  Settings,
  Network,
  Rocket,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

import { useAssets } from "@/components/providers/AssetsProvider";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { AVAILABLE_CONTRACTS } from "@/contracts";

import { useCreateDeployment } from "@/hooks/deployments.hook";

import { deployContract } from "@/services/blockchain/deployer";
import { NETWORKS, getExplorerUrlPath } from "@/services/blockchain/networks";

import type { DeploymentState } from "@/types";

export default function Create() {
  const { isWalletConnected, openWalletModal, walletProvider, switchNetwork } =
    useAssets();

  const useCreateDeploymentMutation = useCreateDeployment();

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

      const compileResponse = await useCreateDeploymentMutation.mutateAsync({
        name: currentContract.name,
        category: currentContract.category || "Smart Contract",
        description: currentContract.description,
        sourceCode,
      });

      console.log(compileResponse);

      const compilationResult = compileResponse.compilationResult;

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

  const getCategoryGradient = (category: string) => {
    const gradients = {
      ERC20: "from-blue-500 to-cyan-500",
      ERC721: "from-purple-500 to-pink-500",
      ERC1155: "from-green-500 to-emerald-500",
      Governance: "from-orange-500 to-red-500",
      DeFi: "from-indigo-500 to-purple-500",
    };
    return (
      gradients[category as keyof typeof gradients] ||
      "from-gray-500 to-gray-600"
    );
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Smart Contract Builder
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Create New Contract
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Build and deploy professional smart contracts with
              industry-standard templates and secure compilation.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Configuration Panel */}
            <Card className="border-slate-700 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Contract Configuration
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Configure your smart contract parameters
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contract Type Selection */}
                <div className="space-y-3">
                  <Label
                    htmlFor="contract-select"
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <Code className="h-4 w-4" />
                    Contract Template
                  </Label>
                  <Select onValueChange={handleContractChange}>
                    <SelectTrigger className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-700 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a contract template" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {AVAILABLE_CONTRACTS.map((contract) => (
                        <SelectItem
                          key={contract.name}
                          value={contract.name}
                          className="text-white hover:bg-slate-700 focus:bg-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-lg bg-gradient-to-r ${getCategoryGradient(contract.category || "ERC20")} flex items-center justify-center`}
                            >
                              <Code className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{contract.name}</div>
                              <div className="text-xs text-slate-400">
                                {contract.category || "Smart Contract"}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Network Selection */}
                <div className="space-y-3">
                  <Label
                    htmlFor="network-select"
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <Network className="h-4 w-4" />
                    Deployment Network
                  </Label>
                  <Select
                    value={deploymentState.selectedChainId.toString()}
                    onValueChange={handleNetworkChange}
                  >
                    <SelectTrigger className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-700 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a network" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-800">
                      {Object.entries(NETWORKS).map(([networkId, network]) => (
                        <SelectItem
                          key={networkId}
                          value={network.id.toString()}
                          className="text-white hover:bg-slate-700 focus:bg-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                            <div className="font-medium">{network.name}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contract Parameters */}
                {currentContract && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-6 w-6 rounded-lg bg-gradient-to-r ${getCategoryGradient(currentContract.category || "ERC20")} flex items-center justify-center`}
                        >
                          <Code className="h-3 w-3 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {currentContract.name} Parameters
                        </h3>
                      </div>
                      <p className="text-sm text-slate-400">
                        Configure the initialization parameters for your
                        contract
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentContract.inputs.map((input) => (
                        <div key={input.name} className="space-y-2">
                          <Label
                            htmlFor={input.name}
                            className="flex items-center gap-2 text-slate-300"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-700">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                            </div>
                            {input.name}
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-xs text-slate-400"
                            >
                              {input.type}
                            </Badge>
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
                            className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deployment Actions */}
                <div className="space-y-6 border-t border-slate-700 pt-6">
                  {!isWalletConnected ? (
                    <div className="rounded-lg border border-slate-600 bg-slate-700/30 p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600/20">
                          <Shield className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-white">
                        Wallet Required
                      </h4>
                      <p className="mb-4 text-sm text-slate-400">
                        Connect your wallet to compile and deploy smart
                        contracts securely
                      </p>
                      <Button
                        onClick={openWalletModal}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white hover:from-blue-700 hover:to-purple-700"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Error Messages */}
                      {(deploymentState.compilationResult?.errors?.length ??
                        0) > 0 && (
                        <div className="rounded-lg border border-red-600 bg-red-900/20 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <h4 className="text-sm font-medium text-red-400">
                              Compilation Errors
                            </h4>
                          </div>
                          <div className="space-y-1">
                            {deploymentState.compilationResult?.errors?.map(
                              (error, index) => (
                                <p key={index} className="text-sm text-red-300">
                                  {error}
                                </p>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {deploymentState.deploymentResult?.error && (
                        <div className="rounded-lg border border-red-600 bg-red-900/20 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <h4 className="text-sm font-medium text-red-400">
                              Deployment Failed
                            </h4>
                          </div>
                          <p className="text-sm text-red-300">
                            {deploymentState.deploymentResult.error}
                          </p>
                        </div>
                      )}

                      {/* Success Message */}
                      {deploymentState.deploymentResult?.success && (
                        <div className="rounded-lg border border-green-600 bg-green-900/20 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <h4 className="text-lg font-medium text-green-400">
                              Contract Deployed Successfully!
                            </h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-300">
                                  Contract Address:
                                </span>
                                <code className="font-mono text-sm text-green-300">
                                  {
                                    deploymentState.deploymentResult
                                      .contractAddress
                                  }
                                </code>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    deploymentState.deploymentResult
                                      ?.contractAddress || "",
                                  )
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                onClick={() =>
                                  window.open(
                                    `${getExplorerUrlPath(deploymentState.selectedChainId)}/address/${deploymentState.deploymentResult?.contractAddress}`,
                                    "_blank",
                                  )
                                }
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Explorer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                onClick={() =>
                                  (window.location.href = "/deploy")
                                }
                              >
                                <Rocket className="mr-2 h-4 w-4" />
                                Manage Deployments
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading State */}
                      {isLoading && (
                        <div className="rounded-lg border border-slate-600 bg-slate-700/30 p-4">
                          <div className="mb-3 flex items-center gap-3">
                            <div className="animate-spin">
                              <Zap className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="font-medium text-white">
                              {deploymentState.isCompiling
                                ? "Compiling Contract..."
                                : "Deploying Contract..."}
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
                            className="mb-2 h-2"
                          />
                          <p className="text-sm text-slate-400">
                            {deploymentState.isCompiling
                              ? "Processing Solidity code and generating bytecode..."
                              : "Broadcasting transaction to the blockchain..."}
                          </p>
                        </div>
                      )}

                      {/* Deploy Button */}
                      <Button
                        onClick={handleCompileAndDeploy}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:from-slate-600 disabled:to-slate-600"
                        disabled={!isFormValid || isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          deploymentState.isCompiling ? (
                            <>
                              <Clock className="mr-2 h-5 w-5 animate-pulse" />
                              Compiling...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-5 w-5 animate-bounce" />
                              Deploying...
                            </>
                          )
                        ) : (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            Compile & Deploy Contract
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="border-slate-700 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Contract Preview
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Live preview of your smart contract code
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentContract ? (
                  <div className="space-y-4">
                    {/* Compilation Status */}
                    {deploymentState.compilationResult && (
                      <div className="rounded-lg border border-slate-600 bg-slate-700/30 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <h4 className="text-sm font-medium text-white">
                              Compilation Status
                            </h4>
                          </div>
                          <Badge
                            className={
                              deploymentState.compilationResult.success
                                ? "bg-green-700 text-green-100"
                                : "bg-red-700 text-red-100"
                            }
                          >
                            <div className="flex items-center gap-1">
                              {deploymentState.compilationResult.success ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {deploymentState.compilationResult.success
                                ? "Success"
                                : "Failed"}
                            </div>
                          </Badge>
                        </div>
                        {deploymentState.compilationResult.warnings &&
                          deploymentState.compilationResult.warnings.length >
                            0 && (
                            <div className="flex items-center gap-2 text-xs text-yellow-400">
                              <AlertCircle className="h-3 w-3" />
                              {
                                deploymentState.compilationResult.warnings
                                  .length
                              }{" "}
                              warning(s)
                            </div>
                          )}
                      </div>
                    )}

                    {/* Contract Info */}
                    <div className="rounded-lg border border-slate-600 bg-slate-700/30 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div
                          className={`h-6 w-6 rounded-lg bg-gradient-to-r ${getCategoryGradient(currentContract.category || "ERC20")} flex items-center justify-center`}
                        >
                          <Code className="h-3 w-3 text-white" />
                        </div>
                        <h4 className="font-medium text-white">
                          {currentContract.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          {currentContract.category || "Smart Contract"}
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-slate-400">
                        {currentContract.description ||
                          "Professional smart contract template with security best practices"}
                      </p>
                    </div>

                    {/* Code Preview */}
                    <div className="rounded-lg border border-slate-600 bg-slate-900/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white">
                          Source Code
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-slate-400 hover:text-white"
                          onClick={() =>
                            navigator.clipboard.writeText(getPreviewCode())
                          }
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <div className="rounded border border-slate-700 bg-slate-950 p-3">
                        <pre className="max-h-96 overflow-auto font-mono text-xs text-slate-300">
                          <code>{getPreviewCode()}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-slate-600 bg-slate-700/30">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-600/50">
                      <Code className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Select a Contract Template
                    </h3>
                    <p className="text-center text-sm text-slate-400">
                      Choose a contract type from the configuration panel to see
                      the live preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
