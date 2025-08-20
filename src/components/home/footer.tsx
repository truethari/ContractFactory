import React from "react";
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
  Twitter,
  Sparkles,
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
              <a
                href="#"
                className="rounded-lg border border-[#23e99d40] bg-[#083322] p-2 text-[#23e99d] transition-colors hover:bg-[#23e99d] hover:text-black"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-[#23e99d40] bg-[#083322] p-2 text-[#23e99d] transition-colors hover:bg-[#23e99d] hover:text-black"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Shield className="h-3 w-3" />
                  Smart Contract Compilation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Zap className="h-3 w-3" />
                  One-Click Deployment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Rocket className="h-3 w-3" />
                  Mainnet and testnet Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Users className="h-3 w-3" />
                  Open Source
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Globe className="h-3 w-3" />
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Code className="h-3 w-3" />
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Sparkles className="h-3 w-3" />
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 transition-colors hover:text-[#23e99d]"
                >
                  <Mail className="h-3 w-3" />
                  Support
                </a>
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
              <a
                href="#"
                className="w-full text-start transition-colors hover:text-[#23e99d]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="w-full text-center whitespace-nowrap transition-colors hover:text-[#23e99d] md:text-start"
              >
                Terms of Service
              </a>
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
