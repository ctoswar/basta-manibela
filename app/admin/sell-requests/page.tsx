import type { Metadata } from "next";
import AdminGuard from "@/components/AdminGuard";
import SellRequestsDashboard from "@/components/SellRequestsDashboard";

export const metadata: Metadata = {
  title: "Admin - Sell Requests",
  robots: { index: false, follow: false },
};

export default function SellRequestsPage() {
  return (
    <AdminGuard>
      <SellRequestsDashboard />
    </AdminGuard>
  );
}
