import { Activity, FileCode, Rocket, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function Overview() {
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
              12
            </div>
            <p className="text-xs" style={{ color: "#a0a0a0" }}>
              +2 from last month
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
              8
            </div>
            <p className="text-xs" style={{ color: "#a0a0a0" }}>
              +1 from last week
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
              98.5%
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
          <CardDescription style={{ color: "#a0a0a0" }}>
            Your latest smart contract deployments and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Deployed ERC20 Token",
                time: "2 hours ago",
                status: "Success",
              },
              {
                action: "Created NFT Collection",
                time: "1 day ago",
                status: "Success",
              },
              {
                action: "Updated Contract Settings",
                time: "3 days ago",
                status: "Pending",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium" style={{ color: "#ffffff" }}>
                    {item.action}
                  </p>
                  <p className="text-sm" style={{ color: "#a0a0a0" }}>
                    {item.time}
                  </p>
                </div>
                <Badge
                  style={{
                    backgroundColor:
                      item.status === "Success" ? "#083322" : "#2d1b69",
                    color: item.status === "Success" ? "#23e99d" : "#a78bfa",
                    borderColor:
                      item.status === "Success" ? "#23e99d" : "#a78bfa",
                  }}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
