"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Rocket,
  Download,
  Copy,
  Code,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Play,
  FileCode,
  Hash,
  Calendar,
  Loader2,
  Sparkles,
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

interface IDeployments {
  id: string;
  name: string;
  category: string; // ERC20, ERC721, etc.
  address: string | null; // null if not deployed
  abi: string | null; // null if not compiled
  status: "deployed" | "not_deployed" | "compiling" | "error";
  createdAt: string; // ISO date string
  description?: string;
  network?: string;
  gasUsed?: string;
  txHash?: string;
}

export default function Deploy() {
  const [deployingId, setDeployingId] = useState<string | null>(null);

  // Dummy data for demonstration
  const deployments: IDeployments[] = [
    {
      id: "1",
      name: "MyToken",
      category: "ERC20",
      address: "0x1234567890123456789012345678901234567890",
      abi: '{"abi": "sample abi content"}',
      status: "deployed",
      createdAt: "2024-01-15T10:30:00Z",
      description: "Custom ERC20 token with burn functionality",
      network: "Hyperliquid",
      gasUsed: "2,345,678",
      txHash:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "2",
      name: "NFTCollection",
      category: "ERC721",
      address: null,
      abi: '{"abi": "compiled abi content"}',
      status: "not_deployed",
      createdAt: "2024-01-14T15:45:00Z",
      description: "Unique NFT collection with metadata",
      network: "Hyperliquid",
    },
    {
      id: "3",
      name: "GameAssets",
      category: "ERC1155",
      address: null,
      abi: null,
      status: "compiling",
      createdAt: "2024-01-14T09:20:00Z",
      description: "Multi-token standard for gaming assets",
      network: "Hyperliquid",
    },
    {
      id: "4",
      name: "FailedContract",
      category: "ERC20",
      address: null,
      abi: null,
      status: "error",
      createdAt: "2024-01-13T12:15:00Z",
      description: "Contract compilation failed",
      network: "Hyperliquid",
    },
  ];

  const getStatusIcon = (status: IDeployments["status"]) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "not_deployed":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "compiling":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: IDeployments["status"]) => {
    const variants = {
      deployed: "bg-green-700 text-green-100",
      not_deployed: "bg-yellow-700 text-yellow-100",
      compiling: "bg-blue-700 text-blue-100",
      error: "bg-red-700 text-red-100",
    };

    const labels = {
      deployed: "Deployed",
      not_deployed: "Ready to Deploy",
      compiling: "Compiling",
      error: "Failed",
    };

    return (
      <Badge className={`${variants[status]} px-3 py-1`}>
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          {labels[status]}
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

  const handleDownloadABI = (deployment: IDeployments) => {
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
              Smart Contract Deployment Center
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Manage Your Deployments
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Deploy, monitor, and manage your smart contracts across multiple
              networks with ease.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
                onClick={() => (window.location.href = "/create")}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Deployment
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card className="border-slate-700 bg-slate-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-600/20 p-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-sm text-slate-400">Deployed</p>
                </div>
              </div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-600/20 p-3">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-sm text-slate-400">Ready</p>
                </div>
              </div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-600/20 p-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-sm text-slate-400">Compiling</p>
                </div>
              </div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-600/20 p-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-sm text-slate-400">Failed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Deployments Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {deployments.map((deployment) => (
              <Card
                key={deployment.id}
                className="group border-slate-700 bg-slate-800/30 transition-all duration-300 hover:bg-slate-800/50 hover:shadow-2xl"
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
                        <CardTitle className="text-xl font-bold text-white">
                          {deployment.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            {deployment.category}
                          </Badge>
                          <span>•</span>
                          <span>{deployment.network}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(deployment.status)}
                  </div>
                  {deployment.description && (
                    <CardDescription className="mt-2 text-slate-300">
                      {deployment.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contract Details */}
                  <div className="space-y-3">
                    {deployment.address && (
                      <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-3">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-slate-400" />
                          <span className="font-mono text-sm text-slate-200">
                            {deployment.address.slice(0, 10)}...
                            {deployment.address.slice(-8)}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopyAddress(deployment.address!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created{" "}
                        {new Date(deployment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {deployment.gasUsed && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Shield className="h-4 w-4" />
                        <span>Gas Used: {deployment.gasUsed}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for Compiling */}
                  {deployment.status === "compiling" && (
                    <div className="space-y-2">
                      <Progress value={65} className="h-2" />
                      <p className="text-sm text-slate-400">
                        Compiling contract...
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {deployment.status === "not_deployed" && deployment.abi && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => handleDownloadABI(deployment)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download ABI
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => handleCopyABI(deployment.abi!)}
                        >
                          <FileCode className="mr-2 h-4 w-4" />
                          Copy ABI
                        </Button>
                      </>
                    )}

                    {deployment.address && deployment.txHash && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() =>
                          window.open(
                            `https://explorer.hyperliquid.io/tx/${deployment.txHash}`,
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
                        className="border-red-600 text-red-300 hover:bg-red-700/20"
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
          </div>

          {/* Empty State */}
          {deployments.length === 0 && (
            <Card className="border-slate-700 bg-slate-800/30 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
                <Rocket className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                No deployments yet
              </h3>
              <p className="mb-6 text-slate-400">
                Start building by creating your first smart contract deployment.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                onClick={() => (window.location.href = "/create")}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Create New Contract
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
