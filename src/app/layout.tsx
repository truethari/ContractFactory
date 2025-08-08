import "./globals.css";

import React from "react";
import {
  Fira_Sans,
  Silkscreen,
  Iceberg,
  Jersey_20,
  Source_Code_Pro,
  Press_Start_2P,
} from "next/font/google";

import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import WalletProvider from "@/components/providers/WalletProvider";
import AssetsProvider from "@/components/providers/AssetsProvider";

import { Toaster } from "@/components/ui/sonner";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract Factory",
  description: "",
};

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaSans.className} dark relative leading-7 antialiased`}
      >
        <QueryProvider>
          <WalletProvider>
            <AssetsProvider>
              <AuthProvider>
                <div className="absolute inset-0 z-[-1] h-full w-full bg-gradient-to-br from-[#0a1114]/50 via-[#052e12]/50 to-[#033011] text-white" />
                {children}
                <Toaster />
              </AuthProvider>
            </AssetsProvider>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
