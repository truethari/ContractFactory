import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">
          Configure your dashboard preferences and account settings
        </p>
      </div>

      <Card style={{ backgroundColor: "#111e17", borderColor: "#083322" }}>
        <CardContent className="p-8">
          <div className="text-center">
            <Settings
              className="mx-auto mb-4 h-16 w-16"
              style={{ color: "#23e99d" }}
            />
            <h3 className="mb-2 text-xl font-semibold text-white">
              Dashboard Settings
            </h3>
            <p className="text-gray-400">
              Customize your dashboard experience and preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
