import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ActivityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold" style={{ color: "#ffffff" }}>
          Activity Feed
        </h1>
        <p style={{ color: "#a0a0a0" }}>
          Track all your blockchain activities and transactions
        </p>
      </div>

      <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
        <CardContent className="p-8">
          <div className="text-center">
            <Activity
              className="mx-auto mb-4 h-16 w-16"
              style={{ color: "#23e99d" }}
            />
            <h3
              className="mb-2 text-xl font-semibold"
              style={{ color: "#ffffff" }}
            >
              Activity Monitoring
            </h3>
            <p style={{ color: "#a0a0a0" }}>
              Comprehensive activity tracking for all your smart contract
              interactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
