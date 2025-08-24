"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Wallet,
  Settings,
  Code,
  Rocket,
  Activity,
  Shield,
  Zap,
  FileCode,
  Eye,
  Play,
  Download,
  Network,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function Docs() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "getting-started": true,
    "wallet-connection": true,
    "dashboard-overview": true,
    "creating-contracts": true,
    "managing-deployments": true,
    "contract-interaction": true,
    "activity-monitoring": true,
    troubleshooting: true,
    "best-practices": true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const Section = ({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[id];
    return (
      <div className="mb-6 rounded-lg border border-emerald-900/20 bg-black/40 backdrop-blur-sm">
        <button
          onClick={() => toggleSection(id)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-emerald-500/5"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="border-t border-emerald-900/20 p-4 text-gray-300">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950/20">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
      <div className="bg-grid-white/[0.02] bg-grid-16 fixed inset-0"></div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-4xl font-bold text-transparent">
            Contract Factory Guide
          </h1>
          <p className="text-lg text-gray-400">
            Complete step-by-step guide to using Contract Factory for smart
            contract deployment
          </p>
        </div>

        {/* Getting Started */}
        <Section id="getting-started" title="Getting Started" icon={Home}>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-400">
              <Home className="h-5 w-5" />
              Homepage Overview
            </h3>
            <p>
              When you first visit Contract Factory, you&apos;ll see the
              homepage with these key sections:
            </p>

            <div className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <h4 className="font-semibold text-emerald-300">
                Main Features Highlighted:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Code className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span>
                    <strong>Smart Contract Compilation</strong> - Compile
                    Solidity contracts with OpenZeppelin libraries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span>
                    <strong>One-Click Deployment</strong> - Deploy to
                    Hyperliquid network directly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span>
                    <strong>Secure & Trusted</strong> - No private keys stored,
                    all transactions from your wallet
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Rocket className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span>
                    <strong>Open Source & Free</strong> - Completely free to use
                    with full transparency
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <h4 className="mb-2 font-semibold text-blue-300">
                Supported Contract Standards:
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "ERC20",
                  "ERC721",
                  "ERC1155",
                  "Ownable",
                  "Pausable",
                  "AccessControl",
                ].map((standard) => (
                  <span
                    key={standard}
                    className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300"
                  >
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Wallet Connection */}
        <Section id="wallet-connection" title="Wallet Connection" icon={Wallet}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Step 1: Connect Your Wallet
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-red-400"></div>
                  Not Connected
                </h4>
                <p className="mb-3 text-sm text-gray-400">
                  Initial state when visiting the site
                </p>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 font-medium text-black">
                  <Shield className="h-4 w-4" />
                  Connect Wallet
                </button>
              </div>

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  Wallet Connected
                </h4>
                <p className="mb-3 text-sm text-gray-400">
                  Shows your wallet address
                </p>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 font-medium text-black">
                  <Users className="h-4 w-4" />
                  Authenticate
                </button>
              </div>

              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                  Ready to Build
                </h4>
                <p className="mb-3 text-sm text-gray-400">
                  Authenticated and ready
                </p>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 font-medium text-black">
                  <Rocket className="h-4 w-4" />
                  Start Building
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <h4 className="mb-2 font-semibold text-blue-300">
                Supported Wallets:
              </h4>
              <div className="flex gap-3">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  MetaMask
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  WalletConnect
                </span>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  Injected Wallets
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Dashboard Overview */}
        <Section
          id="dashboard-overview"
          title="Dashboard Overview"
          icon={Settings}
        >
          <div className="space-y-4">
            <p>
              After authentication, you&apos;ll be redirected to the dashboard
              with these main sections:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Sidebar Navigation:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 rounded bg-emerald-500/10 p-2">
                    <Settings className="h-4 w-4 text-emerald-400" />
                    <span>
                      <strong>Overview</strong> - Dashboard summary and stats
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-blue-500/10 p-2">
                    <FileCode className="h-4 w-4 text-blue-400" />
                    <span>
                      <strong>Create Contract</strong> - Build new contracts
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-purple-500/10 p-2">
                    <Rocket className="h-4 w-4 text-purple-400" />
                    <span>
                      <strong>Deployments</strong> - Manage deployed contracts
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-orange-500/10 p-2">
                    <Activity className="h-4 w-4 text-orange-400" />
                    <span>
                      <strong>Interact</strong> - Call contract functions
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-green-500/10 p-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span>
                      <strong>Activity</strong> - Transaction history
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-gray-500/10 p-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span>
                      <strong>Settings</strong> - Account preferences
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Header Features:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>Current date display</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-400" />
                    <span>Quick &quot;Create Contract&quot; button</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-emerald-400" />
                    <span>Deployment counter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>Activity counter</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Creating Contracts */}
        <Section
          id="creating-contracts"
          title="Creating & Deploying Contracts"
          icon={Code}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Step-by-Step Contract Creation
            </h3>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black">
                    1
                  </span>
                  Select Contract Type
                </h4>
                <p className="mb-3 text-gray-400">
                  Choose from available contract templates:
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {[
                    { name: "ERC20", desc: "Fungible tokens" },
                    { name: "ERC721", desc: "NFTs" },
                    { name: "ERC1155", desc: "Multi-token" },
                  ].map((contract) => (
                    <div
                      key={contract.name}
                      className="rounded border border-emerald-500/20 bg-emerald-500/10 p-3 text-center"
                    >
                      <div className="font-medium text-emerald-300">
                        {contract.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {contract.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black">
                    2
                  </span>
                  Configure Contract Parameters
                </h4>
                <p className="mb-3 text-gray-400">
                  Fill in contract-specific details:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between rounded bg-blue-500/10 p-2">
                    <span>Token Name</span>
                    <span className="text-gray-400">
                      e.g., &quot;My Token&quot;
                    </span>
                  </div>
                  <div className="flex justify-between rounded bg-blue-500/10 p-2">
                    <span>Token Symbol</span>
                    <span className="text-gray-400">e.g., &quot;MTK&quot;</span>
                  </div>
                  <div className="flex justify-between rounded bg-blue-500/10 p-2">
                    <span>Initial Supply</span>
                    <span className="text-gray-400">
                      e.g., &quot;1000000&quot;
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black">
                    3
                  </span>
                  Select Network
                </h4>
                <p className="mb-3 text-gray-400">Choose deployment network:</p>
                <div className="flex items-center gap-3 rounded border border-purple-500/20 bg-purple-500/10 p-3">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">
                    Hyperliquid (Primary Network)
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-black">
                    4
                  </span>
                  Compilation & Deployment
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded bg-yellow-500/10 p-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400"></div>
                    <span className="text-sm">
                      Compiling contract with OpenZeppelin libraries...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded bg-blue-500/10 p-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
                    <span className="text-sm">
                      Deploying to Hyperliquid network...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded bg-green-500/10 p-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">
                      Contract deployed successfully!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Managing Deployments */}
        <Section
          id="managing-deployments"
          title="Managing Deployments"
          icon={Rocket}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Deployment Management Features
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Deployment List View:
                </h4>
                <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">My Token (MTK)</span>
                      <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-300">
                        Deployed
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>Contract: ERC20</div>
                      <div>Network: Hyperliquid</div>
                      <div>Deployed: 2 hours ago</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-500/20 py-1 text-xs text-blue-300">
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button className="flex flex-1 items-center justify-center gap-1 rounded bg-green-500/20 py-1 text-xs text-green-300">
                        <Play className="h-3 w-3" />
                        Interact
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Available Actions:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 rounded bg-blue-500/10 p-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span>
                      <strong>View Details</strong> - Contract address, ABI,
                      source code
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-green-500/10 p-2">
                    <Play className="h-4 w-4 text-green-400" />
                    <span>
                      <strong>Interact</strong> - Call contract functions
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-purple-500/10 p-2">
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                    <span>
                      <strong>View on Explorer</strong> - Check on blockchain
                      explorer
                    </span>
                  </li>
                  <li className="flex items-center gap-2 rounded bg-orange-500/10 p-2">
                    <Download className="h-4 w-4 text-orange-400" />
                    <span>
                      <strong>Download</strong> - Get contract files
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Contract Interaction */}
        <Section
          id="contract-interaction"
          title="Contract Interaction"
          icon={Play}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Interacting with Deployed Contracts
            </h3>

            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
              <h4 className="mb-3 font-semibold text-white">Function Types:</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h5 className="flex items-center gap-2 font-medium text-blue-300">
                    <Eye className="h-4 w-4" />
                    Read Functions (View)
                  </h5>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div>• No gas cost</div>
                    <div>• Get contract state</div>
                    <div>• Examples: balanceOf, totalSupply</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="flex items-center gap-2 font-medium text-green-300">
                    <Play className="h-4 w-4" />
                    Write Functions (Payable/Non-payable)
                  </h5>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div>• Requires gas</div>
                    <div>• Modifies contract state</div>
                    <div>• Examples: transfer, mint, approve</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
              <h4 className="mb-3 font-semibold text-white">
                Example Function Call:
              </h4>
              <div className="space-y-3">
                <div className="rounded border border-blue-500/20 bg-blue-500/10 p-3">
                  <div className="mb-2 font-medium text-blue-300">
                    transfer(address to, uint256 amount)
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-sm">to:</span>
                      <input
                        type="text"
                        className="flex-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm"
                        placeholder="0x..."
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-sm">amount:</span>
                      <input
                        type="text"
                        className="flex-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm"
                        placeholder="1000"
                        readOnly
                      />
                    </div>
                  </div>
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-green-500 py-2 font-medium text-black">
                    <Play className="h-4 w-4" />
                    Execute Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Activity & Monitoring */}
        <Section
          id="activity-monitoring"
          title="Activity & Monitoring"
          icon={Activity}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Track Your Blockchain Activity
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Activity Types:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded bg-blue-500/10 p-2 text-sm">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span>Contract Deployment</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-green-500/10 p-2 text-sm">
                    <Play className="h-4 w-4 text-green-400" />
                    <span>Function Execution</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-purple-500/10 p-2 text-sm">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span>Transaction History</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Activity Details:
                </h4>
                <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Transaction Hash</span>
                      <span className="font-mono text-emerald-400">
                        0x1a2b...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-green-400">Success</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Used</span>
                      <span className="text-gray-400">21,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timestamp</span>
                      <span className="text-gray-400">2 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Troubleshooting */}
        <Section
          id="troubleshooting"
          title="Troubleshooting"
          icon={AlertCircle}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Common Issues & Solutions
            </h3>

            <div className="space-y-4">
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  Wallet Connection Issues
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>
                    • Make sure your wallet extension is installed and unlocked
                  </li>
                  <li>
                    • Check if you&apos;re connected to the correct network
                    (Hyperliquid)
                  </li>
                  <li>
                    • Clear browser cache and cookies if connection persists to
                    fail
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-yellow-300">
                  <AlertCircle className="h-4 w-4" />
                  Deployment Failures
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Ensure you have sufficient balance for gas fees</li>
                  <li>• Verify all contract parameters are correctly filled</li>
                  <li>• Check network connectivity and try again</li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-300">
                  <AlertCircle className="h-4 w-4" />
                  Transaction Issues
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Check if the function parameters are valid</li>
                  <li>
                    • Ensure you have the required permissions for the function
                  </li>
                  <li>
                    • Verify the contract is not paused or has restrictions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section id="best-practices" title="Best Practices" icon={CheckCircle}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">
              Recommendations for Safe Usage
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Security Tips:
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                    <span>
                      Always verify contract addresses before interacting
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                    <span>
                      Double-check function parameters before execution
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                    <span>Test with small amounts first on new contracts</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-300">
                  Development Tips:
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Code className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <span>Use descriptive names for tokens and contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <span>
                      Keep track of deployment addresses and transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                    <span>Download contract files for your records</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="mb-2 text-xl font-semibold text-emerald-300">
              Ready to Get Started?
            </h3>
            <p className="mb-4 text-gray-400">
              Begin your smart contract journey with Contract Factory
            </p>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2 font-medium text-black transition-colors hover:bg-emerald-400"
              >
                <Home className="h-4 w-4" />
                Go to Homepage
              </Link>
              <Link
                href="/dashboard"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-400"
              >
                <Settings className="h-4 w-4" />
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
