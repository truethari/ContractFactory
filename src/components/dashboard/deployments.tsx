"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
  Trash,
  Copy,
  Code,
  Play,
  Clock,
  Hash,
  Plus,
  Rocket,
  Download,
  FileCode,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { useAssets } from "@/components/providers/AssetsProvider";

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

import { useDeleteDeployment } from "@/hooks/deployments.hook";

import { EDeploymentStatus, type IDeployment } from "@/types/deployments.types";

interface Props {
  deployments: IDeployment[];
  onChangeActiveTab: (tab: string) => void;
  refreshAll: () => Promise<void>;
}

export default function Deployments(props: Props) {
  const { deployments, onChangeActiveTab, refreshAll } = props;
  const { copyToClipboard, isWalletConnected, walletProvider } = useAssets();

  const useDeleteDeploymentMutation = useDeleteDeployment();

  const [deployingId, setDeployingId] = useState<string | null>(null);

  // Calculate stats from deployments
  const stats = {
    deployed: deployments.filter((d) => d.status === EDeploymentStatus.DEPLOYED)
      .length,
    ready: deployments.filter((d) => d.status === EDeploymentStatus.COMPILED)
      .length,
    compiling: deployments.filter((d) => d.status === EDeploymentStatus.PENDING)
      .length,
    failed: deployments.filter((d) => d.status === EDeploymentStatus.FAILED)
      .length,
  };

  const getStatusIcon = (status: EDeploymentStatus) => {
    switch (status) {
      case EDeploymentStatus.DEPLOYED:
        return <CheckCircle className="h-5 w-5" style={{ color: "#23e99d" }} />;
      case EDeploymentStatus.COMPILED:
        return <Clock className="h-5 w-5" style={{ color: "#fbbf24" }} />;
      case EDeploymentStatus.PENDING:
        return <Clock className="h-5 w-5" style={{ color: "#a0a0a0" }} />;
      case EDeploymentStatus.FAILED:
        return <AlertCircle className="h-5 w-5" style={{ color: "#f87171" }} />;
      default:
        return <Clock className="h-5 w-5" style={{ color: "#a0a0a0" }} />;
    }
  };

  const getStatusBadge = (status: EDeploymentStatus) => {
    const variants = {
      DEPLOYED: { bg: "#083322", color: "#23e99d" },
      COMPILED: { bg: "#2d1b1b", color: "#fbbf24" },
      PENDING: { bg: "#1e3a8a", color: "#3b82f6" },
      FAILED: { bg: "#2d1b1b", color: "#f87171" },
    };

    const labels = {
      DEPLOYED: "Deployed",
      COMPILED: "Ready to Deploy",
      PENDING: "Compiling",
      FAILED: "Failed",
    };

    const variant =
      variants[status as keyof typeof variants] || variants.FAILED;

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
    const deployment = deployments.find((d) => d.id === id);
    if (!deployment || !deployment.abi) {
      toast.error("Deployment not found or ABI missing");
      return;
    }

    if (!isWalletConnected || !walletProvider) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Since the current system doesn't store bytecode, we need to redirect to create page
    // or provide an alternative flow
    toast.info(
      "To deploy this contract, please visit the 'Create Contract' tab where you can " +
        "recompile and deploy it with the latest settings.",
      {
        duration: 5000,
        action: {
          label: "Go to Create",
          onClick: () => onChangeActiveTab("create"),
        },
      },
    );

    // Alternative: You could implement re-compilation here
    // This would require storing the source code in the deployment record
    // and re-running the compilation process

    setDeployingId(null);
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

  const handleDeleteDeployment = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deployment? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await useDeleteDeploymentMutation.mutateAsync(id);
      toast.success("Deployment deleted successfully");
      await refreshAll();
    } catch (error) {
      console.error("Failed to delete deployment:", error);
      toast.error("Failed to delete deployment. Please try again later.");
    }
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
            className="bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => onChangeActiveTab("create")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create New Deployment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deployments.map((deployment) => (
          <Card
            key={deployment.id}
            className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            style={{
              backgroundColor: "#111e17",
              borderColor: "#083322",
            }}
          >
            {/* Status indicator */}
            <div
              className={`absolute top-0 left-0 h-full w-1 ${
                deployment.status === EDeploymentStatus.DEPLOYED
                  ? "bg-emerald-400"
                  : deployment.status === EDeploymentStatus.COMPILED
                    ? "bg-yellow-400"
                    : deployment.status === EDeploymentStatus.PENDING
                      ? "bg-blue-400"
                      : "bg-red-400"
              }`}
            />

            <CardContent className="p-4 pl-6">
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${getCategoryGradient(deployment.category)} shadow-lg`}
                  >
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {deployment.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {deployment.category}
                    </p>
                  </div>
                </div>
                {getStatusBadge(deployment.status)}
              </div>

              {/* Description */}
              {deployment.description && (
                <p className="mb-3 line-clamp-2 text-xs text-gray-400">
                  {deployment.description}
                </p>
              )}

              {/* Contract details */}
              <div className="mb-4 space-y-2">
                {deployment.address && (
                  <div className="flex items-center gap-2 rounded-md bg-black/30 p-2">
                    <Hash className="h-3 w-3 text-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400">
                      {deployment.address.slice(0, 8)}...
                      {deployment.address.slice(-6)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-emerald-400"
                      onClick={() => copyToClipboard(deployment.address!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Created{" "}
                    {new Date(deployment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Progress bar for compiling */}
                {deployment.status === EDeploymentStatus.PENDING && (
                  <div className="space-y-1">
                    <Progress value={65} className="h-1" />
                    <p className="text-xs text-blue-400">
                      Compiling contract...
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                {/* Primary action */}
                {deployment.status === EDeploymentStatus.COMPILED &&
                  deployment.abi && (
                    <Button
                      size="sm"
                      className="w-full"
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
                          Deploy Contract
                        </>
                      )}
                    </Button>
                  )}

                {deployment.status === EDeploymentStatus.FAILED && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
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
                    Retry Deployment
                  </Button>
                )}

                {/* Secondary actions */}
                <div className="flex gap-2">
                  {deployment.abi && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        style={{
                          borderColor: "#23e99d40",
                          color: "#23e99d",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => handleDownloadABI(deployment)}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        ABI
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        style={{
                          borderColor: "#23e99d40",
                          color: "#23e99d",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => copyToClipboard(deployment.abi!)}
                      >
                        <FileCode className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                    </>
                  )}

                  {deployment.address && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      style={{
                        borderColor: "#23e99d40",
                        color: "#23e99d",
                        backgroundColor: "transparent",
                      }}
                      onClick={() =>
                        window.open(
                          `https://hyperevmscan.io/address/${deployment.address}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    style={{
                      borderColor: "#dc262640",
                      color: "#fca5a5",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => handleDeleteDeployment(deployment.id)}
                  >
                    <Trash className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
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
    </div>
  );
}
