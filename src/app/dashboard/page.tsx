import Dashboard from "@/components/dashboard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Contract Factory",
  description: "Overview of your contracts and their statuses.",
};

export default function Page() {
  return <Dashboard />;
}
