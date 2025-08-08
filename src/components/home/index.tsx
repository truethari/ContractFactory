"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
  Code,
  Zap,
  Shield,
  Rocket,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
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

import { useLogin } from "@/hooks/auth.hook";

export default function Home() {
  const {
    isLoggedIn,
    signMessage,
    walletAddress,
    openWalletModal,
    isWalletConnected,
    refreshLoginStatus,
  } = useAssets();
  const [currentProcess, setCurrentProcess] = useState<string | null>(null);

  const useLoginMutation = useLogin();

  const handleLogin = async () => {
    try {
      if (!isWalletConnected || !walletAddress) return;

      const reqMessage = `Login to Contract Factory at ${new Date().toLocaleString()}`;
      setCurrentProcess("Signing message for login...");
      const { success, message, signature } = await signMessage(reqMessage);
      if (!success || !signature) {
        toast.error("Failed to sign message. Please try again.");
        return;
      }

      setCurrentProcess("Logging in...");

      await useLoginMutation.mutateAsync({
        message,
        signature,
        address: walletAddress,
      });

      refreshLoginStatus();
      toast.success("Login successful!");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to login. Please try again.");
    }

    setCurrentProcess(null);
  };

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Smart Contract Compilation",
      description:
        "Compile Solidity contracts with OpenZeppelin libraries using our secure API",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "One-Click Deployment",
      description: "Deploy to Hyperliquid and more networks with your wallet",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Trustless",
      description:
        "No private keys stored. All deployments happen directly from your wallet",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Open Source & Free",
      description:
        "Built with transparency in mind. Use our tools without any fees",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const supportedContracts = [
    "ERC20",
    "ERC721",
    "ERC1155",
    "Ownable",
    "Pausable",
    "AccessControl",
  ];

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="space-y-12 text-center">
            {/* Main Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Next-gen smart contract deployment
                </div>
                <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-5xl leading-tight font-bold text-transparent sm:text-7xl">
                  Contract{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Factory
                  </span>
                </h1>
                <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-300">
                  Build, compile, and deploy Solidity smart contracts with
                  professional-grade tools.
                  <span className="font-semibold text-blue-400">
                    {" "}
                    Zero fees
                  </span>
                  ,
                  <span className="font-semibold text-green-400">
                    {" "}
                    maximum security
                  </span>
                  .
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-slate-600 px-8 py-6 text-lg text-slate-300 hover:bg-slate-800"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  View Docs
                </Button>
              </div>
            </div>

            {/* Connection Status Card */}
            <Card className="mx-auto max-w-lg border-slate-700 bg-slate-800/50 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                  <CardTitle className="text-xl">Quick Connect</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Connect your wallet to start building on Web3
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isWalletConnected ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                      onClick={openWalletModal}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                      <span>Supports</span>
                      <Badge variant="secondary" className="bg-slate-700">
                        MetaMask
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700">
                        WalletConnect
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700">
                        +More
                      </Badge>
                    </div>
                  </>
                ) : !isLoggedIn ? (
                  <>
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-green-700 px-3 py-1 text-white">
                          <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-300"></div>
                          Wallet Connected
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-4">
                        <p className="font-mono text-lg font-semibold text-slate-200">
                          {walletAddress?.slice(0, 8)}...
                          {walletAddress?.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-6 text-lg font-semibold text-white hover:from-green-700 hover:to-blue-700"
                      onClick={handleLogin}
                      disabled={!!currentProcess}
                    >
                      {currentProcess || (
                        <>
                          <Users className="mr-2 h-5 w-5" />
                          Authenticate
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-base text-white">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ready to Build
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-slate-600 bg-gradient-to-r from-slate-800 to-slate-700 p-6">
                      <p className="mb-2 text-slate-300">Welcome back,</p>
                      <p className="font-mono text-xl font-bold text-white">
                        {walletAddress?.slice(0, 8)}...
                        {walletAddress?.slice(-6)}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="group w-full cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:shadow-xl"
                      onClick={() => (window.location.href = "/deploy")}
                    >
                      <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-[-2px]" />
                      Start Building
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                )}

                {currentProcess && (
                  <div className="space-y-3 rounded-lg border border-slate-600 bg-slate-700/50 p-4">
                    <Progress value={50} className="h-3" />
                    <p className="text-center text-sm font-medium text-slate-300">
                      {currentProcess}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mt-24">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">
                Why Choose Contract Factory?
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-400">
                Everything you need to build, test, and deploy smart contracts
                with confidence
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group border-slate-700 bg-slate-800/30 transition-all duration-300 hover:scale-105 hover:bg-slate-800/50 hover:shadow-2xl"
                >
                  <CardContent className="px-8">
                    <div className="mb-6">
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4`}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <CardTitle className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                        {feature.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supported Contracts */}
          <div className="mt-24 space-y-8 text-center">
            <div>
              <h3 className="mb-4 text-3xl font-bold text-white">
                Supported Standards
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Deploy industry-standard smart contracts with built-in security
                and optimization
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {supportedContracts.map((contract, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer border-slate-600 bg-slate-800/50 px-6 py-3 text-base font-semibold text-slate-200 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  {contract}
                </Badge>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="mt-24 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/30 p-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent">
                  6+
                </div>
                <div className="text-xl font-semibold text-white">
                  Contract Types
                </div>
                <div className="text-sm leading-relaxed text-slate-300">
                  ERC20, ERC721, ERC1155, and more standards supported
                </div>
              </div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/30 p-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
                  100%
                </div>
                <div className="text-xl font-semibold text-white">Secure</div>
                <div className="text-sm leading-relaxed text-slate-300">
                  All transactions signed by your wallet, zero trust required
                </div>
              </div>
            </Card>
            <Card className="border-slate-700 bg-slate-800/30 p-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-5xl font-bold text-transparent">
                  $0
                </div>
                <div className="text-xl font-semibold text-white">
                  Platform Fees
                </div>
                <div className="text-sm leading-relaxed text-slate-300">
                  Open source and completely free to use forever
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
