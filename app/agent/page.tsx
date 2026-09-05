import type { Metadata } from "next";
import AgentDashboard from "@/components/AgentDashboard";
import SalesAgentGuard from "@/components/SalesAgentGuard";

export const metadata: Metadata = {
  title: "Agent Dashboard",
  robots: { index: false, follow: false },
};

export default function AgentPage() {
  return (
    <SalesAgentGuard>
      <AgentDashboard />
    </SalesAgentGuard>
  );
}
