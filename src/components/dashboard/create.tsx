"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Zap,
  Copy,
  Code,
  Clock,
  Shield,
  Rocket,
  Network,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { useAssets } from "@/components/providers/AssetsProvider";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
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

import {
  useCreateDeployment,
  useUpdateDeployment,
} from "@/hooks/deployments.hook";

import { deployContract } from "@/services/blockchain/deployer";
import {
  NETWORKS,
  getChainImage,
  getExplorerUrlPath,
} from "@/services/blockchain/networks";

import type { DeploymentState } from "@/types";

interface Props {
  onChangeActiveTab: (tab: string) => void;
  refreshAll: () => Promise<void>;
}

export default function Create(props: Props) {
  const { onChangeActiveTab, refreshAll } = props;

  const {
    isWalletConnected,
    openWalletModal,
    walletProvider,
    switchNetwork,
    copyToClipboard,
  } = useAssets();

  const useUpdateDeploymentMutation = useUpdateDeployment();
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

      if (
        deploymentResult.transactionHash &&
        deploymentResult.contractAddress
      ) {
        await useUpdateDeploymentMutation.mutateAsync({
          id: compileResponse.deployment.id,
          deployedTx: deploymentResult.transactionHash,
          address: deploymentResult.contractAddress,
        });
      }

      await refreshAll();
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
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>
          Create Contract
        </h1>
        <p style={{ color: "#a0a0a0" }}>
          Build and deploy professional smart contracts with industry-standard
          templates and secure compilation.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Configuration Panel */}
        <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#23e99d" }}
              >
                <Settings className="h-5 w-5" style={{ color: "#000000" }} />
              </div>
              <div>
                <CardTitle className="text-xl" style={{ color: "#ffffff" }}>
                  Contract Configuration
                </CardTitle>
                <CardDescription style={{ color: "#a0a0a0" }}>
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
                className="flex items-center gap-2"
                style={{ color: "#a0a0a0" }}
              >
                <Code className="h-4 w-4" />
                Contract Template
              </Label>
              <Select onValueChange={handleContractChange}>
                <SelectTrigger
                  style={{
                    backgroundColor: "#083322",
                    borderColor: "#23e99d40",
                    color: "#ffffff",
                  }}
                >
                  <SelectValue placeholder="Choose a contract template" />
                </SelectTrigger>
                <SelectContent
                  style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
                >
                  {AVAILABLE_CONTRACTS.map((contract) => (
                    <SelectItem
                      key={contract.name}
                      value={contract.name}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      style={{ color: "#ffffff" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-6 w-6 rounded-lg bg-gradient-to-r ${getCategoryGradient(contract.category || "ERC20")} flex items-center justify-center`}
                        >
                          <Code className="h-2 w-2 text-white" />
                        </div>

                        <div className="font-medium">{contract.name}</div>
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
                className="flex items-center gap-2"
                style={{ color: "#a0a0a0" }}
              >
                <Network className="h-4 w-4" />
                Deployment Network
              </Label>
              <Select
                value={deploymentState.selectedChainId.toString()}
                onValueChange={handleNetworkChange}
              >
                <SelectTrigger
                  style={{
                    backgroundColor: "#083322",
                    borderColor: "#23e99d40",
                    color: "#ffffff",
                  }}
                >
                  <SelectValue placeholder="Choose a network" />
                </SelectTrigger>
                <SelectContent
                  style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
                >
                  {Object.entries(NETWORKS).map(([networkId, network]) => (
                    <SelectItem
                      key={networkId}
                      value={network.id.toString()}
                      style={{ color: "#ffffff" }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getChainImage(Number(network.id))}
                          alt={network.name}
                          className="h-6 w-6 rounded-full"
                        />

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
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      {currentContract.name} Parameters
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "#a0a0a0" }}>
                    Configure the initialization parameters for your contract
                  </p>
                </div>

                <div className="space-y-4">
                  {currentContract.inputs.map((input) => (
                    <div key={input.name} className="space-y-2">
                      <Label
                        htmlFor={input.name}
                        className="flex items-center gap-2"
                        style={{ color: "#a0a0a0" }}
                      >
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded"
                          style={{ backgroundColor: "#083322" }}
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: "#23e99d" }}
                          ></div>
                        </div>
                        {input.name}
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: "#23e99d40",
                            color: "#a0a0a0",
                          }}
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
                        value={deploymentState.contractInputs[input.name] || ""}
                        onChange={(e) =>
                          handleInputChange(input.name, e.target.value)
                        }
                        style={{
                          backgroundColor: "#083322",
                          borderColor: "#23e99d40",
                          color: "#ffffff",
                        }}
                        className="placeholder:text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deployment Actions */}
            <div
              className="space-y-6 border-t pt-6"
              style={{ borderColor: "#083322" }}
            >
              {!isWalletConnected ? (
                <div
                  className="rounded-lg border p-6 text-center"
                  style={{
                    backgroundColor: "#083322",
                    borderColor: "#23e99d40",
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#23e99d40" }}
                    >
                      <Shield
                        className="h-6 w-6"
                        style={{ color: "#23e99d" }}
                      />
                    </div>
                  </div>
                  <h4
                    className="mb-2 text-lg font-semibold"
                    style={{ color: "#ffffff" }}
                  >
                    Wallet Required
                  </h4>
                  <p className="mb-4 text-sm" style={{ color: "#a0a0a0" }}>
                    Connect your wallet to compile and deploy smart contracts
                    securely
                  </p>
                  <Button
                    onClick={openWalletModal}
                    className="px-6 py-3"
                    style={{
                      backgroundColor: "#23e99d",
                      color: "#000000",
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Error Messages */}
                  {(deploymentState.compilationResult?.errors?.length ?? 0) >
                    0 && (
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        backgroundColor: "#2d1b1b",
                        borderColor: "#dc2626",
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <AlertCircle
                          className="h-4 w-4"
                          style={{ color: "#f87171" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "#f87171" }}
                        >
                          Compilation Errors
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {deploymentState.compilationResult?.errors?.map(
                          (error, index) => (
                            <p
                              key={index}
                              className="text-sm"
                              style={{ color: "#fca5a5" }}
                            >
                              {error}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {deploymentState.deploymentResult?.error && (
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        backgroundColor: "#2d1b1b",
                        borderColor: "#dc2626",
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <AlertCircle
                          className="h-4 w-4"
                          style={{ color: "#f87171" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "#f87171" }}
                        >
                          Deployment Failed
                        </h4>
                      </div>
                      <p className="text-sm" style={{ color: "#fca5a5" }}>
                        {deploymentState.deploymentResult.error}
                      </p>
                    </div>
                  )}

                  {/* Success Message */}
                  {deploymentState.deploymentResult?.success && (
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        backgroundColor: "#083322",
                        borderColor: "#23e99d",
                      }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle
                          className="h-5 w-5"
                          style={{ color: "#23e99d" }}
                        />
                        <h4
                          className="text-lg font-medium"
                          style={{ color: "#23e99d" }}
                        >
                          Contract Deployed Successfully!
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div
                          className="flex items-center justify-between rounded-lg p-3"
                          style={{ backgroundColor: "#083322" }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm"
                              style={{ color: "#a0a0a0" }}
                            >
                              Contract Address:
                            </span>
                            <code
                              className="font-mono text-sm"
                              style={{ color: "#23e99d" }}
                            >
                              {deploymentState.deploymentResult.contractAddress}
                            </code>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            style={{ color: "#a0a0a0" }}
                            onClick={() =>
                              copyToClipboard(
                                deploymentState.deploymentResult
                                  ?.contractAddress || "",
                              )
                            }
                          >
                            <Copy className="h-4 w-4 text-black" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            style={{
                              borderColor: "#23e99d",
                              color: "#23e99d",
                              backgroundColor: "transparent",
                            }}
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
                            style={{
                              borderColor: "#23e99d",
                              color: "#23e99d",
                              backgroundColor: "transparent",
                            }}
                            onClick={() => onChangeActiveTab("deployments")}
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
                    <div
                      className="rounded-lg border p-4"
                      style={{
                        backgroundColor: "#083322",
                        borderColor: "#23e99d40",
                      }}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="animate-spin">
                          <Zap
                            className="h-5 w-5"
                            style={{ color: "#23e99d" }}
                          />
                        </div>
                        <span
                          className="font-medium"
                          style={{ color: "#ffffff" }}
                        >
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
                      <p className="text-sm" style={{ color: "#a0a0a0" }}>
                        {deploymentState.isCompiling
                          ? "Processing Solidity code and generating bytecode..."
                          : "Broadcasting transaction to the blockchain..."}
                      </p>
                    </div>
                  )}

                  {/* Deploy Button */}
                  <Button
                    onClick={handleCompileAndDeploy}
                    className="w-full py-6 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                    disabled={!isFormValid || isLoading}
                    size="lg"
                    style={{
                      backgroundColor:
                        isFormValid && !isLoading ? "#23e99d" : "#083322",
                      color: isFormValid && !isLoading ? "#000000" : "#a0a0a0",
                    }}
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
        <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#23e99d" }}
              >
                <Code className="h-5 w-5" style={{ color: "#000000" }} />
              </div>
              <div>
                <CardTitle className="text-xl" style={{ color: "#ffffff" }}>
                  Contract Preview
                </CardTitle>
                <CardDescription style={{ color: "#a0a0a0" }}>
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
                  <div
                    className="rounded-lg border p-4"
                    style={{
                      backgroundColor: "#083322",
                      borderColor: "#23e99d40",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield
                          className="h-4 w-4"
                          style={{ color: "#a0a0a0" }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "#ffffff" }}
                        >
                          Compilation Status
                        </h4>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: deploymentState.compilationResult
                            .success
                            ? "#083322"
                            : "#2d1b1b",
                          color: deploymentState.compilationResult.success
                            ? "#23e99d"
                            : "#f87171",
                        }}
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
                      deploymentState.compilationResult.warnings.length > 0 && (
                        <div
                          className="flex items-center gap-2 text-xs"
                          style={{ color: "#fbbf24" }}
                        >
                          <AlertCircle className="h-3 w-3" />
                          {
                            deploymentState.compilationResult.warnings.length
                          }{" "}
                          warning(s)
                        </div>
                      )}
                  </div>
                )}

                {/* Contract Info */}
                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: "#083322",
                    borderColor: "#23e99d40",
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-lg bg-gradient-to-r ${getCategoryGradient(currentContract.category || "ERC20")} flex items-center justify-center`}
                    >
                      <Code className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="font-medium" style={{ color: "#ffffff" }}>
                      {currentContract.name}
                    </h4>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: "#23e99d40",
                        color: "#a0a0a0",
                      }}
                    >
                      {currentContract.category || "Smart Contract"}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm" style={{ color: "#a0a0a0" }}>
                    {currentContract.description ||
                      "Professional smart contract template with security best practices"}
                  </p>
                </div>

                {/* Code Preview */}
                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "#23e99d40",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4
                      className="text-sm font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      Source Code
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-black"
                      onClick={() => copyToClipboard(getPreviewCode())}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div
                    className="rounded border p-3"
                    style={{
                      backgroundColor: "#000000",
                      borderColor: "#083322",
                    }}
                  >
                    <pre
                      className="max-h-96 overflow-auto font-mono text-xs"
                      style={{ color: "#a0a0a0" }}
                    >
                      <code>{getPreviewCode()}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex h-64 flex-col items-center justify-center rounded-lg border"
                style={{
                  backgroundColor: "#083322",
                  borderColor: "#23e99d40",
                }}
              >
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#23e99d40" }}
                >
                  <Code className="h-8 w-8" style={{ color: "#23e99d" }} />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Select a Contract Template
                </h3>
                <p className="text-center text-sm" style={{ color: "#a0a0a0" }}>
                  Choose a contract type from the configuration panel to see the
                  live preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
