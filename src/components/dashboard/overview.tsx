"use client";

import { useMemo } from "react";
import { FileCode, Rocket, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { timestampToLocalDateAndTime } from "@/utils/timestamp";

import type { IActivity } from "@/types/activities.types";
import { type IDeployment, EDeploymentStatus } from "@/types/deployments.types";

interface Props {
  deployments: IDeployment[];
  activities: IActivity[];
  isLoading: boolean;
  isError: boolean;
  refresh: () => void;
}

export default function Overview(props: Props) {
  const { activities, isLoading, isError, refresh } = props;

  const [totalDeployments, activeContracts, successRate] = useMemo(() => {
    const total = props.deployments.length;
    const active = props.deployments.filter(
      (deployment) => deployment.status === EDeploymentStatus.DEPLOYED,
    ).length;
    const successCount = props.deployments.filter(
      (deployment) => deployment.status === EDeploymentStatus.DEPLOYED,
    ).length;
    const rate = total > 0 ? (successCount / total) * 100 : 0;

    return [total, active, rate.toFixed(1)];
  }, [props.deployments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>
          Dashboard{" "}
          <span className="gradient-text-primary" style={{ color: "unset" }}>
            Overview
          </span>
        </h1>
        <p style={{ color: "#a0a0a0" }}>
          Welcome to your smart contract deployment dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
        <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: "#ffffff" }}
            >
              Total Deployments
            </CardTitle>
            <Rocket className="h-4 w-4" style={{ color: "#23e99d" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              {totalDeployments}
            </div>
            <p className="text-xs" style={{ color: "#a0a0a0" }}>
              +{totalDeployments} from last month
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: "#ffffff" }}
            >
              Active Contracts
            </CardTitle>
            <FileCode className="h-4 w-4" style={{ color: "#23e99d" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              {activeContracts}
            </div>
            <p className="text-xs" style={{ color: "#a0a0a0" }}>
              +{activeContracts} from last week
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: "#ffffff" }}
            >
              Success Rate
            </CardTitle>
            <Settings className="h-4 w-4" style={{ color: "#23e99d" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              {successRate}%
            </div>
            <p className="text-xs" style={{ color: "#a0a0a0" }}>
              Deployment success
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
        <CardHeader>
          <CardTitle style={{ color: "#ffffff" }}>Recent Activity</CardTitle>
          <CardDescription
            style={{ color: "#a0a0a0" }}
            className="flex w-full justify-between"
          >
            <div>Your latest smart contract deployments and activities</div>
            <Button onClick={refresh}>Refresh</Button>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="animate-spin">
                <Rocket className="h-12 w-12" style={{ color: "#23e99d" }} />
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "#ffffff" }}
              >
                Loading Activities
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                Fetching your latest smart contract activities...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div
                className="rounded-full p-4"
                style={{ backgroundColor: "#f8717140" }}
              >
                <Rocket className="h-12 w-12" style={{ color: "#f87171" }} />
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "#f87171" }}
              >
                Error Loading Activities
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                There was an error fetching your activities. Please try again.
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div
                className="rounded-full p-4"
                style={{ backgroundColor: "#f8717140" }}
              >
                <Rocket className="h-12 w-12" style={{ color: "#f87171" }} />
              </div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "#ffffff" }}
              >
                No Recent Activities
              </h3>
              <p style={{ color: "#a0a0a0" }}>
                You have no recent smart contract activities.
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            {activities.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium" style={{ color: "#ffffff" }}>
                    {item.description}
                  </p>
                  <p className="text-sm" style={{ color: "#a0a0a0" }}>
                    {timestampToLocalDateAndTime(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
