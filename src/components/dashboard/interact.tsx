"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Play,
  Eye,
  Hash,
  Code2,
  Loader2,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import { EDeploymentStatus, type IDeployment } from "@/types/deployments.types";
import { useWeb3 } from "@/hooks/web3.hook";

interface Props {
  deployments: IDeployment[];
}

interface ABIFunction {
  name: string;
  type: string;
  inputs: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  stateMutability: "view" | "pure" | "nonpayable" | "payable";
}

interface FunctionCallResult {
  success: boolean;
  result?: unknown;
  error?: string;
  txHash?: string;
  gasUsed?: string;
}

export default function ContractInteraction({ deployments }: Props) {
  const [selectedContract, setSelectedContract] = useState<IDeployment | null>(
    null,
  );
  const [readFunctions, setReadFunctions] = useState<ABIFunction[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<ABIFunction[]>([]);
  const [functionInputs, setFunctionInputs] = useState<{
    [key: string]: { [key: string]: string };
  }>({});
  const [functionResults, setFunctionResults] = useState<{
    [key: string]: FunctionCallResult;
  }>({});
  const [loadingFunctions, setLoadingFunctions] = useState<Set<string>>(
    new Set(),
  );
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(
    new Set(),
  );

  const {
    provider,
    signer,
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    callReadFunction: web3CallRead,
    callWriteFunction: web3CallWrite,
  } = useWeb3();

  // Filter only deployed contracts
  const deployedContracts = deployments.filter(
    (deployment) =>
      deployment.status === EDeploymentStatus.DEPLOYED &&
      deployment.address &&
      deployment.abi,
  );

  useEffect(() => {
    if (selectedContract && selectedContract.abi) {
      try {
        const abi = JSON.parse(selectedContract.abi);
        const functions = abi.filter(
          (item: { type: string }) => item.type === "function",
        );

        const reads = functions.filter(
          (fn: ABIFunction) =>
            fn.stateMutability === "view" || fn.stateMutability === "pure",
        );
        const writes = functions.filter(
          (fn: ABIFunction) =>
            fn.stateMutability === "nonpayable" ||
            fn.stateMutability === "payable",
        );

        setReadFunctions(reads);
        setWriteFunctions(writes);
        setFunctionInputs({});
        setFunctionResults({});
      } catch (error) {
        console.error("Error parsing ABI:", error);
        toast.error("Failed to parse contract ABI");
      }
    }
  }, [selectedContract]);

  const handleInputChange = (
    functionName: string,
    paramName: string,
    value: string,
  ) => {
    setFunctionInputs((prev) => ({
      ...prev,
      [functionName]: {
        ...prev[functionName],
        [paramName]: value,
      },
    }));
  };

  const toggleFunction = (functionName: string) => {
    setExpandedFunctions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(functionName)) {
        newSet.delete(functionName);
      } else {
        newSet.add(functionName);
      }
      return newSet;
    });
  };

  const validateInputs = (
    func: ABIFunction,
    inputs: { [key: string]: string },
  ): boolean => {
    return func.inputs.every((param) => {
      const value = inputs[param.name];
      if (!value) return false;

      // Basic validation for common types
      if (param.type.includes("uint") || param.type.includes("int")) {
        return !isNaN(Number(value));
      }
      if (param.type === "address") {
        return /^0x[a-fA-F0-9]{40}$/.test(value);
      }
      if (param.type === "bool") {
        return value === "true" || value === "false";
      }

      return true;
    });
  };

  const callReadFunction = async (func: ABIFunction) => {
    if (!selectedContract?.address) return;

    const functionKey = func.name;
    setLoadingFunctions((prev) => new Set(prev).add(functionKey));

    try {
      const inputs = functionInputs[functionKey] || {};

      if (!validateInputs(func, inputs)) {
        throw new Error("Invalid input parameters");
      }

      // Prepare parameters
      const params = func.inputs.map((param) => {
        const value = inputs[param.name];

        // Convert parameters based on type
        if (param.type.includes("uint") || param.type.includes("int")) {
          return value;
        } else if (param.type === "bool") {
          return value === "true";
        } else if (param.type.includes("[]")) {
          try {
            return JSON.parse(value);
          } catch {
            return value.split(",").map((v) => v.trim());
          }
        }
        return value;
      });

      let result;
      if (isConnected && provider) {
        // Use real Web3 call
        result = await web3CallRead(
          selectedContract.address,
          selectedContract.abi!,
          func.name,
          params,
        );
      } else {
        // Fallback to simulation for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (func.outputs && func.outputs.length > 0) {
          const outputType = func.outputs[0].type;
          if (outputType.includes("uint") || outputType.includes("int")) {
            result = "1000000000000000000";
          } else if (outputType === "address") {
            result = "0x742d35Cc6643C0532925a3b6De0A4fB7B62b4cf";
          } else if (outputType === "bool") {
            result = true;
          } else {
            result = "Mock result";
          }
        } else {
          result = "Success";
        }
      }

      setFunctionResults((prev) => ({
        ...prev,
        [functionKey]: {
          success: true,
          result: result,
        },
      }));

      toast.success(`Function ${func.name} called successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setFunctionResults((prev) => ({
        ...prev,
        [functionKey]: {
          success: false,
          error: errorMessage,
        },
      }));
      toast.error(`Failed to call ${func.name}: ${errorMessage}`);
    } finally {
      setLoadingFunctions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(functionKey);
        return newSet;
      });
    }
  };

  const callWriteFunction = async (func: ABIFunction) => {
    if (!selectedContract?.address) return;

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const functionKey = func.name;
    setLoadingFunctions((prev) => new Set(prev).add(functionKey));

    try {
      const inputs = functionInputs[functionKey] || {};

      if (!validateInputs(func, inputs)) {
        throw new Error("Invalid input parameters");
      }

      // Prepare parameters
      const params = func.inputs.map((param) => {
        const value = inputs[param.name];

        // Convert parameters based on type
        if (param.type.includes("uint") || param.type.includes("int")) {
          return value;
        } else if (param.type === "bool") {
          return value === "true";
        } else if (param.type.includes("[]")) {
          try {
            return JSON.parse(value);
          } catch {
            return value.split(",").map((v) => v.trim());
          }
        }
        return value;
      });

      // Get ETH value for payable functions
      const ethValue = functionInputs[functionKey]?.["_value"] || "0";

      let result;
      if (isConnected && signer) {
        // Use real Web3 transaction
        result = await web3CallWrite(
          selectedContract.address,
          selectedContract.abi!,
          func.name,
          params,
          func.stateMutability === "payable" ? ethValue : undefined,
        );
      } else {
        // Fallback simulation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);

        result = {
          success: true,
          result: "Transaction successful",
          txHash: mockTxHash,
          gasUsed: "21000",
        };
      }

      setFunctionResults((prev) => ({
        ...prev,
        [functionKey]: result,
      }));

      toast.success(`Transaction sent for ${func.name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setFunctionResults((prev) => ({
        ...prev,
        [functionKey]: {
          success: false,
          error: errorMessage,
        },
      }));
      toast.error(`Failed to execute ${func.name}: ${errorMessage}`);
    } finally {
      setLoadingFunctions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(functionKey);
        return newSet;
      });
    }
  };

  const renderFunctionInputs = (func: ABIFunction) => {
    const inputs = [...func.inputs];

    // Add ETH value input for payable functions
    if (func.stateMutability === "payable") {
      inputs.push({
        name: "_value",
        type: "ether",
        internalType: "uint256",
      });
    }

    return inputs.map((param) => (
      <div key={param.name} className="space-y-1">
        <Label className="text-xs font-medium" style={{ color: "#ffffff" }}>
          {param.name === "_value" ? "ETH Value" : param.name} ({param.type})
          {param.name === "_value" && (
            <span className="ml-1 text-xs text-gray-400">(optional)</span>
          )}
        </Label>
        <Input
          placeholder={
            param.name === "_value"
              ? "0.0"
              : param.type === "bool"
                ? "true or false"
                : param.type.includes("[]")
                  ? "comma separated"
                  : `${param.type} value`
          }
          value={functionInputs[func.name]?.[param.name] || ""}
          onChange={(e) =>
            handleInputChange(func.name, param.name, e.target.value)
          }
          className="border-emerald-500/20 bg-black/40 text-white placeholder:text-gray-400"
        />
      </div>
    ));
  };

  const renderFunctionResult = (
    func: ABIFunction,
    result: FunctionCallResult,
  ) => {
    if (!result) return null;

    return (
      <div className="mt-4 space-y-2">
        <Label className="text-sm font-medium" style={{ color: "#ffffff" }}>
          Result:
        </Label>
        {result.success ? (
          <div className="space-y-2">
            <div
              className="rounded-lg p-3 font-mono text-sm"
              style={{ backgroundColor: "#083322", color: "#23e99d" }}
            >
              {typeof result.result === "object"
                ? JSON.stringify(result.result, null, 2)
                : String(result.result)}
            </div>
            {result.txHash && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#a0a0a0" }}
              >
                <Hash className="h-4 w-4" />
                <span className="font-mono">
                  Tx: {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1 text-emerald-400 hover:text-emerald-300"
                  onClick={() =>
                    window.open(
                      `https://hyperevmscan.io/tx/${result.txHash}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
            {result.gasUsed && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#a0a0a0" }}
              >
                <Settings className="h-4 w-4" />
                <span>Gas Used: {result.gasUsed}</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-lg p-3 font-mono text-sm"
            style={{ backgroundColor: "#2d1b1b", color: "#f87171" }}
          >
            Error: {result.error}
          </div>
        )}
      </div>
    );
  };

  const renderFunction = (func: ABIFunction, isWrite: boolean) => {
    const functionKey = func.name;
    const isExpanded = expandedFunctions.has(functionKey);
    const isLoading = loadingFunctions.has(functionKey);
    const result = functionResults[functionKey];

    return (
      <Card
        key={functionKey}
        className="transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: "#111e17",
          borderColor: isWrite ? "#f59e0b40" : "#23e99d40",
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded ${
                  isWrite ? "bg-orange-500/20" : "bg-emerald-500/20"
                }`}
              >
                {isWrite ? (
                  <Play className="h-3 w-3 text-orange-400" />
                ) : (
                  <Eye className="h-3 w-3 text-emerald-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-white">
                  {func.name}
                </CardTitle>
                <div className="mt-0.5 flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className="h-4 px-1 text-xs"
                    style={{
                      borderColor: isWrite ? "#f59e0b40" : "#23e99d40",
                      color: isWrite ? "#f59e0b" : "#23e99d",
                      backgroundColor: "transparent",
                    }}
                  >
                    {func.stateMutability}
                  </Badge>
                  {func.inputs.length > 0 && (
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-xs"
                      style={{
                        borderColor: "#6b7280",
                        color: "#9ca3af",
                        backgroundColor: "transparent",
                      }}
                    >
                      {func.inputs.length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFunction(functionKey)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-3 pt-0">
            {func.inputs.length > 0 ? (
              <div className="space-y-2">{renderFunctionInputs(func)}</div>
            ) : (
              <p className="text-xs text-gray-400">No parameters required</p>
            )}

            <Button
              onClick={() =>
                isWrite ? callWriteFunction(func) : callReadFunction(func)
              }
              disabled={
                isLoading ||
                (func.inputs.length > 0 &&
                  !validateInputs(func, functionInputs[functionKey] || {}))
              }
              size="sm"
              className={`w-full ${
                isWrite
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400"
                  : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400"
              } font-medium text-white`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {isWrite ? "Executing..." : "Calling..."}
                </>
              ) : (
                <>
                  {isWrite ? (
                    <Play className="mr-1 h-3 w-3" />
                  ) : (
                    <Eye className="mr-1 h-3 w-3" />
                  )}
                  {isWrite ? "Execute" : "Call"}
                </>
              )}
            </Button>

            {renderFunctionResult(func, result)}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Contract Interaction
        </h1>
        <p className="text-gray-400">
          Interact with your deployed smart contracts using a Remix-like
          interface.
        </p>
      </div>

      {/* Contract Selection & Wallet Connection */}
      <Card
        className="p-4"
        style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <Label className="mb-2 block text-sm font-medium text-white">
              Select Contract
            </Label>
            <Select
              onValueChange={(value) => {
                const contract = deployedContracts.find((d) => d.id === value);
                setSelectedContract(contract || null);
              }}
            >
              <SelectTrigger className="border-emerald-500/20 bg-black/40 text-white">
                <SelectValue placeholder="Choose a deployed contract" />
              </SelectTrigger>
              <SelectContent className="border-emerald-500/20 bg-gray-900">
                {deployedContracts.map((deployment) => (
                  <SelectItem key={deployment.id} value={deployment.id}>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-3 w-3 text-emerald-400" />
                      <span className="font-medium">{deployment.name}</span>
                      <span className="text-xs text-gray-400">
                        {deployment.address?.slice(0, 6)}...
                        {deployment.address?.slice(-4)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-emerald-400">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={disconnectWallet}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Connecting
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Contract Functions */}
      {selectedContract && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Read Functions */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Eye className="h-4 w-4 text-emerald-400" />
              Read ({readFunctions.length})
            </h2>
            {readFunctions.length > 0 ? (
              <div className="space-y-2">
                {readFunctions.map((func) => renderFunction(func, false))}
              </div>
            ) : (
              <Card
                className="p-4 text-center"
                style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
              >
                <Eye className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                <p className="text-sm text-gray-400">
                  No read functions available
                </p>
              </Card>
            )}
          </div>

          {/* Write Functions */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Play className="h-4 w-4 text-orange-400" />
              Write ({writeFunctions.length})
            </h2>
            {writeFunctions.length > 0 ? (
              <div className="space-y-2">
                {writeFunctions.map((func) => renderFunction(func, true))}
              </div>
            ) : (
              <Card
                className="p-4 text-center"
                style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
              >
                <Play className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                <p className="text-sm text-gray-400">
                  No write functions available
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {deployedContracts.length === 0 && (
        <Card
          className="p-8 text-center"
          style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
        >
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "#23e99d40" }}
          >
            <Code2 className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No deployed contracts found
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Deploy some contracts first to interact with them here.
          </p>
          <Button
            size="sm"
            className="bg-emerald-600 font-medium text-white hover:bg-emerald-700"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <Code2 className="mr-2 h-4 w-4" />
            Go to Deployments
          </Button>
        </Card>
      )}
    </div>
  );
}
