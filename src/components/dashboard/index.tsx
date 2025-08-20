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
  Sparkles,
  TrendingUp,
  Clock,
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
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
        <div className="bg-grid-white/[0.02] bg-grid-16 absolute inset-0"></div>
      </div>

      {/* Floating elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 animate-pulse rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/3 blur-3xl delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
        {/* Mobile Header */}
        {isMobile && (
          <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-emerald-900/20 bg-black/80 p-4 backdrop-blur-xl md:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              Contract Factory
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:scale-105 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black backdrop-blur-sm md:hidden"
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
          <div className="flex h-full flex-col border-r border-emerald-900/20 bg-black/40 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl">
            {/* Sidebar Header */}
            <div className="border-b border-emerald-900/20 p-4">
              <div className="flex items-center justify-between">
                {(sidebarOpen || isMobile) && (
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-emerald-400"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
                      <Sparkles className="h-4 w-4 text-black" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                      Contract Factory
                    </span>
                  </Link>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="group cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:scale-105 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  {sidebarOpen || isMobile ? (
                    <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  ) : (
                    <Menu className="h-4 w-4 transition-transform group-hover:scale-110" />
                  )}
                </button>
              </div>

              {/* Quick stats in sidebar when open */}
              {(sidebarOpen || isMobile) && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 p-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-emerald-300">
                        {deploymentsData?.length || 0} Deployed
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-300">
                        {activitiesData?.length || 0} Activities
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sidebarItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id} className="group">
                      <button
                        className={`relative flex w-full cursor-pointer items-center justify-start gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                          isActive
                            ? "border border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/25"
                            : "border border-transparent text-gray-300 hover:border hover:border-emerald-500/20 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-emerald-600/5 hover:text-emerald-100"
                        }`}
                        onClick={() => handleChangeActiveTab(item.id)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        {/* Background glow effect */}
                        {isActive && (
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-emerald-400/20 to-emerald-600/20"></div>
                        )}

                        <div className="relative z-10 flex w-full items-center gap-3">
                          <Icon
                            className={`h-5 w-5 transition-all duration-200 ${
                              isActive
                                ? "scale-110 drop-shadow-sm"
                                : "group-hover:scale-110"
                            }`}
                            style={{
                              color: isActive ? "white" : "inherit",
                            }}
                          />
                          {(sidebarOpen || isMobile) && (
                            <span
                              className={`transition-all duration-200 ${isActive ? "font-semibold" : ""}`}
                            >
                              {item.label}
                            </span>
                          )}
                        </div>

                        {/* Ripple effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            {(sidebarOpen || isMobile) && (
              <div className="border-t border-emerald-900/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                    Contract Factory v1.0
                  </div>
                  <div className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                    BETA
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-hidden ${isMobile ? "pt-16" : ""} relative`}
        >
          <div className="h-full overflow-auto">
            {/* Dashboard Header */}
            <div className="sticky top-0 z-20 border-b border-emerald-900/20 bg-black/20 p-4 backdrop-blur-xl sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    Welcome back! 👋
                  </h1>
                  <p className="mt-1 flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("create")}
                    className="flex items-center rounded-xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40"
                  >
                    <FileCode className="mr-2 h-4 w-4" />
                    Create Contract
                  </button>

                  {/* Stats Cards */}
                  <div className="hidden items-center gap-3 sm:flex">
                    <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 px-4 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                        <span className="text-sm font-medium text-emerald-300">
                          {deploymentsData?.length || 0} Deployed
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/5 px-4 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">
                          {activitiesData?.length || 0} Activities
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 sm:p-6 md:p-8">
              {isLoadingDeployments ? (
                <Card className="relative mb-10 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 p-8 text-center shadow-2xl shadow-emerald-500/5 backdrop-blur-sm">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5"></div>

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                      {/* Spinning loader with glow effect */}
                      <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400 opacity-20 blur-xl"></div>
                      <div className="relative rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 p-4 shadow-lg shadow-emerald-500/25">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center">
                      <h3 className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-xl font-semibold text-transparent">
                        Loading Deployments
                      </h3>
                      <p className="flex items-center justify-center gap-2 text-gray-400">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 delay-100"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 delay-200"></div>
                        </div>
                        Fetching your smart contract deployments...
                      </p>
                    </div>
                  </div>
                </Card>
              ) : isErrorDeployments ? (
                <Card className="relative mb-10 overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-600/10 p-8 text-center shadow-2xl shadow-red-500/5 backdrop-blur-sm">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                      {/* Error icon with glow effect */}
                      <div className="absolute inset-0 animate-pulse rounded-full bg-red-400 opacity-20 blur-xl"></div>
                      <div className="relative rounded-full bg-gradient-to-r from-red-400 to-red-500 p-4 shadow-lg shadow-red-500/25">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <div className="space-y-4 text-center">
                      <h3 className="bg-gradient-to-r from-red-200 to-red-100 bg-clip-text text-xl font-semibold text-transparent">
                        Failed to Load Deployments
                      </h3>
                      <p className="max-w-md text-red-300/80">
                        {deploymentsError?.message ||
                          "An error occurred while fetching your deployments."}
                      </p>

                      <Button
                        onClick={() => refetchDeployments()}
                        className="mt-4 rounded-xl border border-red-400/30 bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 font-medium text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 hover:from-red-400 hover:to-red-500 hover:shadow-red-500/40"
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : null}

              {/* Tab Content with fade-in animation */}
              <div className="animate-in fade-in-0 duration-300">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
