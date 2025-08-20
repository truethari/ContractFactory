"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import {
  Zap,
  Code,
  Globe,
  Users,
  Shield,
  Rocket,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import BgCircles from "@/components/animations/bgCircles";

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
    disconnectWallet,
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
      icon: <Code className="h-5 w-5" />,
      title: "Smart Contract Compilation",
      description:
        "Compile Solidity contracts with OpenZeppelin libraries using our secure API",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "One-Click Deployment",
      description: "Deploy to Hyperliquid and more networks with your wallet",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Trusted",
      description:
        "No private keys stored. All deployments happen directly from your wallet",
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Open Source & Free",
      description:
        "Built with transparency in mind. Use our tools without any fees",
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
      <BgCircles />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl space-y-8 text-center md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm"
              style={{
                backgroundColor: "#083322",
                color: "#23e99d",
                borderColor: "#23e99d40",
              }}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Smart contract deployment made simple
            </div>

            <h1
              className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "#ffffff" }}
            >
              <span
                className="gradient-text-primary py-2"
                style={{ color: "unset" }}
              >
                Contract Factory
              </span>
            </h1>

            <div
              className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl"
              style={{ color: "#a0a0a0" }}
            >
              Build, compile, and deploy Solidity smart contracts with
              professional grade tools.
              <br className="hidden sm:block" />{" "}
              <span className="block sm:inline">
                <span
                  className="gradient-text-accent font-bold"
                  style={{ color: "unset" }}
                >
                  No Code
                </span>
                ,{" "}
                <span
                  className="gradient-text-success font-bold"
                  style={{ color: "unset" }}
                >
                  Zero fees
                </span>
                ,{" "}
                <span
                  className="gradient-text-warning font-bold"
                  style={{ color: "unset" }}
                >
                  maximum security
                </span>
                .
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="rounded-md px-6 py-3 font-medium sm:px-8"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Get started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-md px-6 py-3 font-medium sm:px-8"
              style={{
                borderColor: "#23e99d",
                color: "#23e99d",
                backgroundColor: "transparent",
              }}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">View </span>Documentation
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 md:mt-24">
          <div className="mb-12 text-center md:mb-16">
            <h2
              className="mb-4 text-2xl font-normal sm:text-3xl"
              style={{ color: "#ffffff" }}
            >
              Why choose{" "}
              <span
                className="gradient-text-secondary"
                style={{ color: "unset" }}
              >
                Contract Factory
              </span>
              ?
            </h2>
            <p
              className="mx-auto max-w-2xl text-base sm:text-lg"
              style={{ color: "#a0a0a0" }}
            >
              Everything you need to build, test, and deploy smart contracts
              with confidence
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-4 transition-colors sm:p-6"
                style={{
                  backgroundColor: "#111e17",
                  borderColor: "#083322",
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="shrink-0 rounded-lg border p-2"
                    style={{
                      backgroundColor: "#083322",
                      borderColor: "#23e99d40",
                    }}
                  >
                    <div style={{ color: "#23e99d" }}>{feature.icon}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle
                      className="mb-2 text-base font-medium sm:text-lg"
                      style={{ color: "#ffffff" }}
                    >
                      {feature.title}
                    </CardTitle>
                    <CardDescription
                      className="text-sm leading-relaxed sm:text-base"
                      style={{ color: "#a0a0a0" }}
                    >
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Supported Contracts */}
        <div className="mt-16 text-center md:mt-24">
          <h3
            className="mb-4 text-xl font-normal sm:text-2xl"
            style={{ color: "#ffffff" }}
          >
            Supported standards
          </h3>
          <p
            className="mx-auto mb-6 max-w-2xl text-sm sm:text-base md:mb-8"
            style={{ color: "#a0a0a0" }}
          >
            Deploy industry-standard smart contracts with built-in security and
            optimization
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {supportedContracts.map((contract, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-2 py-1 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm"
                style={{
                  borderColor: "#23e99d",
                  backgroundColor: "#083322",
                  color: "#23e99d",
                }}
              >
                {contract}
              </Badge>
            ))}
          </div>
        </div>

        {/* Connection Card */}
        <div className="mx-auto mt-12 max-w-xl md:mt-16">
          <Card
            className="shadow-sm"
            style={{
              backgroundColor: "#111e17",
              borderColor: "#083322",
            }}
          >
            <CardHeader className="pb-4 text-center">
              <CardTitle
                className="text-base font-medium sm:text-lg"
                style={{ color: "#ffffff" }}
              >
                Quick Connect
              </CardTitle>
              <CardDescription
                className="text-sm sm:text-base"
                style={{ color: "#a0a0a0" }}
              >
                Connect your wallet to start building
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-[-1rem] space-y-3 sm:space-y-4">
              {!isWalletConnected ? (
                <>
                  <Button
                    size="lg"
                    className="w-full py-3 font-medium"
                    style={{
                      backgroundColor: "#23e99d",
                      color: "#000000",
                    }}
                    onClick={openWalletModal}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                  <div
                    className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm"
                    style={{ color: "#a0a0a0" }}
                  >
                    <span>Supports</span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: "#083322",
                        color: "#23e99d",
                        borderColor: "#23e99d40",
                      }}
                    >
                      MetaMask
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: "#083322",
                        color: "#23e99d",
                        borderColor: "#23e99d40",
                      }}
                    >
                      WalletConnect
                    </Badge>
                  </div>
                </>
              ) : !isLoggedIn ? (
                <>
                  <div className="space-y-3 text-center">
                    <Badge
                      style={{
                        backgroundColor: "#083322",
                        color: "#23e99d",
                        borderColor: "#23e99d",
                      }}
                    >
                      Wallet Connected
                    </Badge>
                    <div
                      className="rounded-lg border p-2 sm:p-3"
                      style={{
                        backgroundColor: "#083322",
                        borderColor: "#23e99d40",
                      }}
                    >
                      <p
                        className="font-mono text-xs break-all sm:text-sm"
                        style={{ color: "#23e99d" }}
                      >
                        {walletAddress}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full py-3 font-medium"
                    style={{
                      backgroundColor: "#23e99d",
                      color: "#000000",
                    }}
                    onClick={handleLogin}
                    disabled={!!currentProcess}
                  >
                    {currentProcess || (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Authenticate
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4 text-center">
                  <Badge
                    style={{
                      backgroundColor: "#083322",
                      color: "#23e99d",
                      borderColor: "#23e99d",
                    }}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Ready to build
                  </Badge>
                  <div
                    className="rounded-lg border p-3 sm:p-4"
                    style={{
                      backgroundColor: "#083322",
                      borderColor: "#23e99d40",
                    }}
                  >
                    <p
                      className="mb-1 text-xs sm:text-sm"
                      style={{ color: "#a0a0a0" }}
                    >
                      Welcome back
                    </p>
                    <p
                      className="font-mono text-xs font-medium break-all sm:text-sm"
                      style={{ color: "#23e99d" }}
                    >
                      {walletAddress}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full py-3 font-medium"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Start Building
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full py-3 font-medium"
                    style={{
                      borderColor: "#23e99d",
                      color: "#23e99d",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => {
                      disconnectWallet();
                      refreshLoginStatus();
                      toast.success("Wallet disconnected successfully");
                    }}
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              )}

              {currentProcess && (
                <div
                  className="space-y-2 rounded-lg border p-2 sm:p-3"
                  style={{
                    backgroundColor: "#083322",
                    borderColor: "#23e99d40",
                  }}
                >
                  <Progress value={50} className="h-2" />
                  <p
                    className="text-center text-xs sm:text-sm"
                    style={{ color: "#23e99d" }}
                  >
                    {currentProcess}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 md:mt-24">
          {[
            {
              number: "6+",
              label: "Contract types",
              desc: "ERC20, ERC721, ERC1155, and more",
            },
            {
              number: "100%",
              label: "Secure",
              desc: "All transactions signed by your wallet",
            },
            {
              number: "$0",
              label: "Platform fees",
              desc: "Open source and completely free",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`mb-2 text-2xl font-bold sm:text-3xl ${
                  index === 0
                    ? "gradient-text-accent"
                    : index === 1
                      ? "gradient-text-success"
                      : "gradient-text-warning"
                }`}
              >
                {stat.number}
              </div>
              <div
                className="mb-1 text-base font-medium sm:text-lg"
                style={{ color: "#ffffff" }}
              >
                {stat.label}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: "#a0a0a0" }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
