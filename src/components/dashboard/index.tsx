"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  X,
  Menu,
  Wallet,
  Rocket,
  Loader2,
  Activity,
  FileCode,
  Settings,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

import Create from "./create";
import WalletTab from "./wallet";
import Overview from "./overview";
import SettingsTab from "./settings";
import ActivityTab from "./activity";
import Deployments from "./deployments";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useActivities } from "@/hooks/activities.hook";
import { useGetDeployments } from "@/hooks/deployments.hook";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    data: deploymentsData,
    error: deploymentsError,
    refetch: refetchDeployments,
    isError: isErrorDeployments,
    isLoading: isLoadingDeployments,
  } = useGetDeployments();

  const {
    data: activitiesData,
    refetch: refetchActivities,
    isError: isErrorActivities,
    isLoading: isLoadingActivities,
  } = useActivities();

  const refreshAll = async () => {
    await refetchDeployments();
    await refetchActivities();
  };

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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* Mobile Header */}
      {isMobile && (
        <div
          className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b p-4 md:hidden"
          style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
        >
          <Link href="/" className="text-lg font-semibold text-white">
            Contract Factory
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer text-gray-400 transition-all hover:scale-105 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`
        }`}
      >
        <div
          className="flex h-full flex-col border-r"
          style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
        >
          {/* Sidebar Header */}
          <div className="border-b p-4" style={{ borderColor: "#083322" }}>
            <div className="flex items-center justify-between">
              {(sidebarOpen || isMobile) && (
                <Link href="/" className="text-lg font-semibold text-white">
                  Contract Factory
                </Link>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="cursor-pointer text-gray-400 transition-all hover:scale-105 hover:text-white"
              >
                {sidebarOpen || isMobile ? (
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
                      {(sidebarOpen || isMobile) && item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          {(sidebarOpen || isMobile) && (
            <div className="border-t p-4" style={{ borderColor: "#083322" }}>
              <div className="text-xs text-gray-500">Contract Factory v1.0</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-hidden ${isMobile ? "pt-16" : ""}`}>
        <div className="h-full overflow-auto">
          <div className="flex flex-col p-4 sm:p-6 md:p-8">
            {isLoadingDeployments ? (
              <Card
                style={{ backgroundColor: "#111e17", borderColor: "#083322" }}
                className="mb-10 p-8 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin">
                    <Loader2
                      className="h-12 w-12"
                      style={{ color: "#23e99d" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      Loading Deployments
                    </h3>
                    <p style={{ color: "#a0a0a0" }}>
                      Fetching your smart contract deployments...
                    </p>
                  </div>
                </div>
              </Card>
            ) : isErrorDeployments ? (
              <Card
                className="mb-10 p-8 text-center"
                style={{
                  backgroundColor: "#2d1b1b",
                  borderColor: "#dc2626",
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="rounded-full p-4"
                    style={{ backgroundColor: "#f8717140" }}
                  >
                    <AlertCircle
                      className="h-12 w-12"
                      style={{ color: "#f87171" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: "#f87171" }}
                    >
                      Failed to Load Deployments
                    </h3>
                    <p className="mb-4" style={{ color: "#fca5a5" }}>
                      {deploymentsError?.message ||
                        "An error occurred while fetching your deployments."}
                    </p>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: "#dc2626",
                        color: "#fca5a5",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => refetchDeployments()}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            <>
              {activeTab === "overview" && (
                <Overview
                  deployments={deploymentsData || []}
                  activities={activitiesData || []}
                  isLoading={isLoadingActivities}
                  isError={isErrorActivities}
                  refresh={refetchActivities}
                />
              )}
              {activeTab === "create" && (
                <Create
                  refreshAll={refreshAll}
                  onChangeActiveTab={handleChangeActiveTab}
                />
              )}
              {activeTab === "deployments" && (
                <Deployments
                  deployments={deploymentsData || []}
                  refreshAll={refreshAll}
                  onChangeActiveTab={handleChangeActiveTab}
                />
              )}
              {activeTab === "activity" && <ActivityTab />}
              {activeTab === "wallet" && <WalletTab />}
              {activeTab === "settings" && <SettingsTab />}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
