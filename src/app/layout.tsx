import "./globals.css";

import React from "react";
import { Inter } from "next/font/google";

import QueryProvider from "@/components/providers/QueryProvider";
import WalletProvider from "@/components/providers/WalletProvider";
import AssetsProvider from "@/components/providers/AssetsProvider";

import { Toaster } from "@/components/ui/sonner";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract Factory",
  description: "",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark relative antialiased`}>
        <QueryProvider>
          <WalletProvider>
            <AssetsProvider>
              <div className="absolute z-[-1] h-full min-h-screen min-w-screen bg-black">
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]"></div>
              </div>

              {children}
              <Toaster />
            </AssetsProvider>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
