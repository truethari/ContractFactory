import "./globals.css";

import React from "react";
import { Fira_Sans } from "next/font/google";

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
      <body className={`${firaSans.className} dark antialiased`}>
        <WalletProvider>
          <AssetsProvider>
            {children}
            <Toaster />
          </AssetsProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
