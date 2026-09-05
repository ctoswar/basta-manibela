import type { Metadata } from "next";
import AdminInventory from "@/components/AdminInventory";
import AdminGuard from "@/components/AdminGuard";

export const metadata: Metadata = {
  title: "Admin inventory",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminInventory />
    </AdminGuard>
  );
}
