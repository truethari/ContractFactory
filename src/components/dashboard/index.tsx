"use client";

import { useState } from "react";
import {
  X,
  Menu,
  Wallet,
  Rocket,
  Activity,
  FileCode,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import Create from "./create";
import WalletTab from "./wallet";
import Overview from "./overview";
import SettingsTab from "./settings";
import ActivityTab from "./activity";
import Deployments from "./deployments";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "create", label: "Create Contract", icon: FileCode },
    { id: "deployments", label: "Deployments", icon: Rocket },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleChangeActiveTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;

      case "create":
        return <Create />;

      case "deployments":
        return <Deployments onChangeActiveTab={handleChangeActiveTab} />;

      case "activity":
        return <ActivityTab />;

      case "wallet":
        return <WalletTab />;

      case "settings":
        return <SettingsTab />;

      default:
        return <div className="text-white">Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`}
      >
        <div
          className="flex h-full flex-col border-r"
          style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
        >
          {/* Sidebar Header */}
          <div className="border-b p-4" style={{ borderColor: "#083322" }}>
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold text-white">Dashboard</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="cursor-pointer text-gray-400 transition-all hover:scale-105 hover:text-white"
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className={`flex w-full cursor-pointer items-center justify-start gap-2 rounded-md px-2 py-2 text-left ${
                        activeTab === item.id
                          ? "bg-[#23e99d] font-semibold text-black/80"
                          : "hover:bg-chart-5 text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleChangeActiveTab(item.id)}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{
                          color: activeTab === item.id ? "black" : "inherit",
                          marginRight: sidebarOpen ? "8px" : "0",
                        }}
                      />
                      {sidebarOpen && item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="border-t p-4" style={{ borderColor: "#083322" }}>
              <div className="text-xs text-gray-500">Contract Factory v1.0</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="p-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
