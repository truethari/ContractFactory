import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function WalletTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Wallet Management
        </h1>
        <p className="text-gray-400">
          Manage your wallet connections and settings
        </p>
      </div>

      <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
        <CardContent className="p-8">
          <div className="text-center">
            <Wallet
              className="mx-auto mb-4 h-16 w-16"
              style={{ color: "#23e99d" }}
            />
            <h3 className="mb-2 text-xl font-semibold text-white">
              Wallet Settings
            </h3>
            <p className="text-gray-400">
              Configure your wallet connections and manage your assets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
