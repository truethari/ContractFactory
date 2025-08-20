"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import { Shield, Users } from "lucide-react";

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

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    walletAddress,
    isWalletConnected,
    openWalletModal,
    isLoggedIn,
    refreshLoginStatus,
    signMessage,
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

  return (
    <>
      {isLoggedIn ? (
        <>{children}</>
      ) : (
        <div className="mx-auto flex h-full min-h-screen items-center justify-center p-4 sm:p-6">
          <Card
            className="w-full max-w-md shadow-sm sm:max-w-lg"
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
                You are not logged in
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
                      className="text-xs sm:text-sm"
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
              ) : null}

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
      )}
    </>
  );
}
