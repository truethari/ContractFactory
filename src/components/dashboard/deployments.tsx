"use client";

import { toast } from "sonner";
import { useState, useMemo } from "react";
import {
  Rocket,
  Download,
  Copy,
  Code,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Play,
  FileCode,
  Hash,
  Calendar,
  Loader2,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { useGetDeployments } from "@/hooks/deployments.hook";

import type { IDeployment } from "@/types/deployments.types";

interface Props {
  onChangeActiveTab: (tab: string) => void;
}

export default function Deployments(props: Props) {
  const { onChangeActiveTab } = props;

  const [deployingId, setDeployingId] = useState<string | null>(null);

  const {
    data: deploymentsData,
    isLoading: isLoadingDeployments,
    isError: isErrorDeployments,
    error: deploymentsError,
  } = useGetDeployments();

  const dummyDeployments: IDeployment[] = [
    {
      id: "dummy-1",
      name: "MyToken",
      category: "ERC20",
      address: "0x1234567890123456789012345678901234567890",
      abi: '{"abi": "sample abi content"}',
      status: "deployed",
      createdAt: new Date("2024-01-15T10:30:00Z"),
      updatedAt: new Date("2024-01-15T10:35:00Z"),
      description: "Custom ERC20 token with burn functionality",
      wallet: "0x742d35Cc6634C0532925a3b8D0d8E6d9A9e2e7A7",
      deployedTx:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "dummy-2",
      name: "NFTCollection",
      category: "ERC721",
      address: undefined,
      abi: '{"abi": "compiled abi content"}',
      status: "compiled",
      createdAt: new Date("2024-01-14T15:45:00Z"),
      updatedAt: new Date("2024-01-14T15:45:00Z"),
      description: "Unique NFT collection with metadata",
      wallet: "0x742d35Cc6634C0532925a3b8D0d8E6d9A9e2e7A7",
    },
    {
      id: "dummy-3",
      name: "GameAssets",
      category: "ERC1155",
      address: undefined,
      abi: undefined,
      status: "not_compiled",
      createdAt: new Date("2024-01-14T09:20:00Z"),
      updatedAt: new Date("2024-01-14T09:20:00Z"),
      description: "Multi-token standard for gaming assets",
      wallet: "0x742d35Cc6634C0532925a3b8D0d8E6d9A9e2e7A7",
    },
    {
      id: "dummy-4",
      name: "FailedContract",
      category: "ERC20",
      address: undefined,
      abi: undefined,
      status: "error",
      createdAt: new Date("2024-01-13T12:15:00Z"),
      updatedAt: new Date("2024-01-13T12:15:00Z"),
      description: "Contract compilation failed",
      wallet: "0x742d35Cc6634C0532925a3b8D0d8E6d9A9e2e7A7",
    },
  ];

  const deployments: IDeployment[] = useMemo(() => {
    return [...(deploymentsData || []), ...dummyDeployments];
  }, [deploymentsData, dummyDeployments]);

  // Calculate stats from deployments
  const stats = {
    deployed: deployments.filter((d) => d.status === "deployed").length,
    ready: deployments.filter((d) => d.status === "compiled").length,
    compiling: deployments.filter((d) => d.status === "compiling").length,
    failed: deployments.filter((d) => d.status === "error").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-5 w-5" style={{ color: "#23e99d" }} />;
      case "compiled":
        return <Clock className="h-5 w-5" style={{ color: "#fbbf24" }} />;
      case "not_compiled":
        return <Clock className="h-5 w-5" style={{ color: "#a0a0a0" }} />;
      case "compiling":
        return (
          <Loader2
            className="h-5 w-5 animate-spin"
            style={{ color: "#3b82f6" }}
          />
        );
      case "error":
        return <AlertCircle className="h-5 w-5" style={{ color: "#f87171" }} />;
      default:
        return <Clock className="h-5 w-5" style={{ color: "#a0a0a0" }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      deployed: { bg: "#083322", color: "#23e99d" },
      compiled: { bg: "#2d1b1b", color: "#fbbf24" },
      not_compiled: { bg: "#2d2d2d", color: "#a0a0a0" },
      compiling: { bg: "#1e3a8a", color: "#3b82f6" },
      error: { bg: "#2d1b1b", color: "#f87171" },
    };

    const labels = {
      deployed: "Deployed",
      compiled: "Ready to Deploy",
      not_compiled: "Not Compiled",
      compiling: "Compiling",
      error: "Failed",
    };

    const variant =
      variants[status as keyof typeof variants] || variants.not_compiled;

    return (
      <Badge
        className="px-3 py-1"
        style={{
          backgroundColor: variant.bg,
          color: variant.color,
          borderColor: variant.color + "40",
        }}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          {labels[status as keyof typeof labels] || "Unknown"}
        </div>
      </Badge>
    );
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      ERC20: "from-blue-500 to-cyan-500",
      ERC721: "from-purple-500 to-pink-500",
      ERC1155: "from-green-500 to-emerald-500",
      Ownable: "from-orange-500 to-red-500",
    };
    return (
      gradients[category as keyof typeof gradients] ||
      "from-gray-500 to-gray-600"
    );
  };

  const handleDeploy = async (id: string) => {
    setDeployingId(id);
    toast.info("Starting deployment...");

    // Simulate deployment process
    setTimeout(() => {
      setDeployingId(null);
      toast.success("Contract deployed successfully!");
    }, 3000);
  };

  const handleDownloadABI = (deployment: IDeployment) => {
    if (!deployment.abi) {
      toast.error("ABI not available");
      return;
    }

    const blob = new Blob([deployment.abi], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deployment.name}_abi.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ABI downloaded!");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const handleCopyABI = (abi: string) => {
    navigator.clipboard.writeText(abi);
    toast.success("ABI copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>
          Deployments
        </h1>
        <p style={{ color: "#a0a0a0" }}>
          Deploy, monitor, and manage your smart contracts with ease.
        </p>
        <div className="mt-6">
          <Button
            size="lg"
            className="px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{
              backgroundColor: "#23e99d",
              color: "#000000",
            }}
            onClick={() => onChangeActiveTab("create")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create New Deployment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!isLoadingDeployments && !isErrorDeployments && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card
            style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: "#23e99d40" }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: "#23e99d" }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {stats.deployed}
                </p>
                <p className="text-sm" style={{ color: "#a0a0a0" }}>
                  Deployed
                </p>
              </div>
            </div>
          </Card>
          <Card
            style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: "#fbbf2440" }}
              >
                <Clock className="h-6 w-6" style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {stats.ready}
                </p>
                <p className="text-sm" style={{ color: "#a0a0a0" }}>
                  Ready
                </p>
              </div>
            </div>
          </Card>
          <Card
            style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: "#3b82f640" }}
              >
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: "#3b82f6" }}
                />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {stats.compiling}
                </p>
                <p className="text-sm" style={{ color: "#a0a0a0" }}>
                  Compiling
                </p>
              </div>
            </div>
          </Card>
          <Card
            style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: "#f8717140" }}
              >
                <AlertCircle className="h-6 w-6" style={{ color: "#f87171" }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {stats.failed}
                </p>
                <p className="text-sm" style={{ color: "#a0a0a0" }}>
                  Failed
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoadingDeployments && (
        <div className="flex items-center justify-center py-12">
          <Card
            style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            className="p-8 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <Loader2 className="h-12 w-12" style={{ color: "#23e99d" }} />
              </div>
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "#ffffff" }}
                >
                  Loading Deployments
                </h3>
                <p style={{ color: "#a0a0a0" }}>
                  Fetching your smart contract deployments...
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Error State */}
      {isErrorDeployments && (
        <div className="flex items-center justify-center py-12">
          <Card
            className="p-8 text-center"
            style={{
              backgroundColor: "#2d1b1b",
              borderColor: "#dc2626",
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="rounded-full p-4"
                style={{ backgroundColor: "#f8717140" }}
              >
                <AlertCircle
                  className="h-12 w-12"
                  style={{ color: "#f87171" }}
                />
              </div>
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "#f87171" }}
                >
                  Failed to Load Deployments
                </h3>
                <p className="mb-4" style={{ color: "#fca5a5" }}>
                  {deploymentsError?.message ||
                    "An error occurred while fetching your deployments."}
                </p>
                <Button
                  variant="outline"
                  style={{
                    borderColor: "#dc2626",
                    color: "#fca5a5",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Deployments Grid */}
      {!isLoadingDeployments && !isErrorDeployments && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {deployments.map((deployment) => (
            <Card
              key={deployment.id}
              className="group transition-all duration-300 hover:shadow-2xl"
              style={{
                backgroundColor: "#111e17",
                borderColor: "#083322",
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${getCategoryGradient(deployment.category)}`}
                    >
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle
                        className="text-xl font-bold"
                        style={{ color: "#ffffff" }}
                      >
                        {deployment.name}
                      </CardTitle>
                      <div
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "#a0a0a0" }}
                      >
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: "#23e99d40",
                            color: "#a0a0a0",
                          }}
                        >
                          {deployment.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(deployment.status)}
                </div>
                {deployment.description && (
                  <CardDescription
                    className="mt-2"
                    style={{ color: "#a0a0a0" }}
                  >
                    {deployment.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contract Details */}
                <div className="space-y-3">
                  {deployment.address && (
                    <div
                      className="flex items-center justify-between rounded-lg p-3"
                      style={{ backgroundColor: "#083322" }}
                    >
                      <div className="flex items-center gap-2">
                        <Hash
                          className="h-4 w-4"
                          style={{ color: "#a0a0a0" }}
                        />
                        <span
                          className="font-mono text-sm"
                          style={{ color: "#ffffff" }}
                        >
                          {deployment.address.slice(0, 10)}...
                          {deployment.address.slice(-8)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        style={{ color: "#a0a0a0" }}
                        onClick={() => handleCopyAddress(deployment.address!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#a0a0a0" }}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created{" "}
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#a0a0a0" }}
                  >
                    <span>
                      Wallet: {deployment.wallet.slice(0, 6)}...
                      {deployment.wallet.slice(-4)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Compiling */}
                {deployment.status === "compiling" && (
                  <div className="space-y-2">
                    <Progress value={65} className="h-2" />
                    <p className="text-sm" style={{ color: "#a0a0a0" }}>
                      Compiling contract...
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {deployment.status === "compiled" && deployment.abi && (
                    <Button
                      size="sm"
                      className="transition-all duration-300"
                      style={{
                        backgroundColor: "#23e99d",
                        color: "#000000",
                      }}
                      onClick={() => handleDeploy(deployment.id)}
                      disabled={deployingId === deployment.id}
                    >
                      {deployingId === deployment.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Deploy
                        </>
                      )}
                    </Button>
                  )}

                  {deployment.abi && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        style={{
                          borderColor: "#23e99d",
                          color: "#23e99d",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => handleDownloadABI(deployment)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download ABI
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        style={{
                          borderColor: "#23e99d",
                          color: "#23e99d",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => handleCopyABI(deployment.abi!)}
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        Copy ABI
                      </Button>
                    </>
                  )}

                  {deployment.address && deployment.deployedTx && (
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
                          `https://explorer.hyperliquid.io/tx/${deployment.deployedTx}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Explorer
                    </Button>
                  )}

                  {deployment.status === "error" && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{
                        borderColor: "#dc2626",
                        color: "#fca5a5",
                        backgroundColor: "transparent",
                      }}
                      onClick={() =>
                        toast.info("Retry functionality coming soon!")
                      }
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {deployments.length === 0 && (
            <Card
              className="col-span-full p-12 text-center"
              style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "#23e99d40" }}
              >
                <Rocket className="h-8 w-8" style={{ color: "#23e99d" }} />
              </div>
              <h3
                className="mb-2 text-xl font-semibold"
                style={{ color: "#ffffff" }}
              >
                No deployments yet
              </h3>
              <p className="mb-6" style={{ color: "#a0a0a0" }}>
                Start building by creating your first smart contract deployment.
              </p>
              <Button
                size="lg"
                className="transition-all duration-300"
                style={{
                  backgroundColor: "#23e99d",
                  color: "#000000",
                }}
                onClick={() => (window.location.href = "/create")}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Create New Contract
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
