"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Car,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import vehiclesData from "@/lib/data/vehicles.json";
import type { Vehicle, ReservationRequest } from "@/lib/types";
import { formatPHP, formatKm } from "@/lib/format";

const AUTH_KEY = "basta-manibela:agent-auth";
const RESERVATIONS_KEY = "basta-manibela:reservations";

// Mock reservations data
const MOCK_RESERVATIONS: (ReservationRequest & {
  id: string;
  vehicleTitle: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
})[] = [
  {
    id: "r1",
    vehicleId: "v1",
    vehicleTitle: "2020 Toyota Vios 1.3 E CVT",
    name: "Juan Dela Cruz",
    phone: "+63 917 123 4567",
    email: "juan@email.com",
    message: "Interested in this unit. Can I schedule a test drive?",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "r2",
    vehicleId: "v3",
    vehicleTitle: "2021 Honda Click 150i",
    name: "Maria Santos",
    phone: "+63 918 234 5678",
    email: "maria@email.com",
    message: "Is this still available? Can we meet this weekend?",
    status: "confirmed",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "r3",
    vehicleId: "v5",
    vehicleTitle: "2019 Mitsubishi Xpander GLS",
    name: "Pedro Reyes",
    phone: "+63 919 345 6789",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

function statusTone(status: string) {
  return {
    pending:
      "border-amber-400/20 bg-amber-400/10 text-amber-200",
    confirmed:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    cancelled:
      "border-white/10 bg-white/5 text-muted",
  }[status] ?? "border-white/10 bg-white/5 text-muted";
}

export default function AgentDashboard() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("");
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        setAgentName(session.name || "Agent");
      } catch {
        setAgentName("Agent");
      }
    }
  }, []);

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    router.push("/login");
  }

  function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  const counts = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-surface/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold">
              Basta Manibela / Agent Portal
            </p>
            <h1 className="mt-2 font-display text-4xl text-paper">
              Welcome, {agentName}
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 border border-white/10 px-4 py-2 font-body text-xs text-muted transition-colors hover:border-red-400/50 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats */}
        <div className="mb-8 grid gap-3 sm:grid-cols-4">
          {[
            ["Total", counts.total, "text-paper"],
            ["Pending", counts.pending, "text-amber-200"],
            ["Confirmed", counts.confirmed, "text-emerald-300"],
            ["Cancelled", counts.cancelled, "text-muted"],
          ].map(([label, count, color]) => (
            <div
              key={label}
              className="border-l border-gold/50 bg-surface px-5 py-4"
            >
              <p className="font-body text-[11px] uppercase tracking-widest text-muted">
                {label}
              </p>
              <p className={`mt-2 font-display text-3xl ${color}`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Reservations table */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-paper">
            Recent Reservations
          </h2>
          <p className="mt-1 font-body text-sm text-muted">
            Customer inquiries and test drive requests
          </p>
        </div>

        <div className="overflow-x-auto border border-white/10 bg-surface">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr className="font-body text-[11px] uppercase tracking-widest text-muted">
                <th className="px-5 py-4 font-normal">Customer</th>
                <th className="px-5 py-4 font-normal">Vehicle</th>
                <th className="px-5 py-4 font-normal">Contact</th>
                <th className="px-5 py-4 font-normal">Status</th>
                <th className="px-5 py-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="group transition-colors hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-4">
                    <p className="font-display text-lg text-paper">
                      {reservation.name}
                    </p>
                    <p className="mt-1 font-body text-xs text-muted">
                      {new Date(reservation.createdAt).toLocaleDateString(
                        "en-PH",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-body text-sm text-silver">
                      {reservation.vehicleTitle}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 font-body text-xs text-silver">
                        <Phone className="h-3 w-3 text-muted" />
                        {reservation.phone}
                      </p>
                      {reservation.email && (
                        <p className="flex items-center gap-1.5 font-body text-xs text-silver">
                          <Mail className="h-3 w-3 text-muted" />
                          {reservation.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex border px-2 py-1 font-body text-[10px] uppercase tracking-wider ${statusTone(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {reservation.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(reservation.id, "confirmed")
                            }
                            aria-label="Confirm reservation"
                            className="border border-white/10 p-2 text-silver transition-colors hover:border-emerald-400/50 hover:text-emerald-300"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(reservation.id, "cancelled")
                            }
                            aria-label="Cancel reservation"
                            className="border border-white/10 p-2 text-silver transition-colors hover:border-red-400/50 hover:text-red-300"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && (
            <p className="px-5 py-14 text-center font-body text-sm text-muted">
              No reservations yet.
            </p>
          )}
        </div>

        {/* Vehicle quick stats */}
        <div className="mt-10">
          <h2 className="font-display text-2xl text-paper">Inventory Overview</h2>
          <p className="mt-1 font-body text-sm text-muted">
            Current vehicle stock for quick reference
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(vehiclesData as Vehicle[])
            .filter((v) => v.status === "available")
            .slice(0, 6)
            .map((vehicle) => (
              <div
                key={vehicle.id}
                className="border border-white/10 bg-surface p-4 transition-colors hover:border-gold/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-paper">
                      {vehicle.title}
                    </p>
                    <p className="mt-1 font-body text-xs text-muted">
                      {vehicle.year} · {formatKm(vehicle.mileageKm)} ·{" "}
                      {vehicle.location}
                    </p>
                  </div>
                  <span className="border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-body text-[10px] uppercase tracking-wider text-emerald-300">
                    Available
                  </span>
                </div>
                <p className="mt-3 font-display text-xl text-gold-bright">
                  {formatPHP(vehicle.price)}
                </p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
