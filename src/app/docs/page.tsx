import Docs from "@/components/docs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - Contract Factory",
  description: "Comprehensive documentation for the Contract Factory tool.",
};

export default function Page() {
  return (
    <main>
      <Docs />
    </main>
  );
}
