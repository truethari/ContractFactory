import React from "react";
import Link from "next/link";
import {
  Zap,
  Mail,
  Code,
  Users,
  Globe,
  Heart,
  Rocket,
  Shield,
  Github,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  supportedContracts: string[];
}

export default function Footer(props: Props) {
  const { supportedContracts } = props;

  return (
    <footer className="mt-20 rounded-xl border-t border-[#083322] bg-[#0a1a0f] pt-12 pb-8">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-[#23e99d]" />
              <h3 className="text-lg font-bold text-white">Contract Factory</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              The ultimate platform for building, compiling, and deploying
              Solidity smart contracts with zero fees and maximum security.
            </p>
            <div className="flex gap-3">
              <Link
                target="_blank"
                href="https://github.com/truethari/ContractFactory"
                className="rounded-lg border border-[#23e99d40] bg-[#083322] p-2 text-[#23e99d] transition-colors hover:bg-[#23e99d] hover:text-black"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <div className="flex items-center gap-2 transition-colors hover:text-[#23e99d]">
                  <Shield className="h-3 w-3" />
                  Smart Contract Compilation
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 transition-colors hover:text-[#23e99d]">
                  <Zap className="h-3 w-3" />
                  One-Click Deployment
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 transition-colors hover:text-[#23e99d]">
                  <Rocket className="h-3 w-3" />
                  Mainnet and testnet Support
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 transition-colors hover:text-[#23e99d]">
                  <Users className="h-3 w-3" />
                  Open Source
                </div>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/docs"
                  target="_blank"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Globe className="h-3 w-3" />
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>

              <li>
                <Link
                  target="_blank"
                  href="https://github.com/truethari/ContractFactory/issues"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Mail className="h-3 w-3" />
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contracts */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contract Templates</h4>
            <div className="flex flex-wrap gap-2">
              {supportedContracts.slice(0, 4).map((contract, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: "#23e99d40",
                    backgroundColor: "#083322",
                    color: "#23e99d",
                  }}
                >
                  {contract}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              And {supportedContracts.length - 4}+ more contract standards
              supported
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-[#083322] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 md:justify-start">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-[#23e99d] text-[#23e99d]" />
              <span>for the Web3 community</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-2 text-sm text-gray-400 md:flex md:gap-6">
              <span className="col-span-full w-full text-center whitespace-nowrap md:text-start">
                © 2025 Contract Factory
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
