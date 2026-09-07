"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  Phone,
  Search,
  X,
  Check,
  Clock,
  Eye,
  Ban,
} from "lucide-react";
import { formatPHP, formatKm } from "@/lib/format";
import type { StoredSellRequest, SellRequestStatus } from "@/lib/types";

const AUTH_KEY = "basta-manibela:admin-auth";

const STATUS_CONFIG: Record<
  SellRequestStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  reviewed: {
    label: "Reviewed",
    color: "border-blue-400/20 bg-blue-400/10 text-blue-200",
    icon: <Eye className="h-3 w-3" />,
  },
  accepted: {
    label: "Accepted",
    color: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    icon: <Check className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    color: "border-white/10 bg-white/5 text-muted",
    icon: <Ban className="h-3 w-3" />,
  },
};

export default function SellRequestsDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<StoredSellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SellRequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<StoredSellRequest | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/sell-car");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: SellRequestStatus) {
    try {
      const res = await fetch(`/api/sell-car/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: data.data.updatedAt } : r))
        );
        setNotice(`Status updated to ${newStatus}`);
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    router.push("/admin/login");
  }

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesQuery =
        !normalizedQuery ||
        [r.name, r.phone, r.brand, r.model, `${r.brand} ${r.model}`].some((v) =>
          v.toLowerCase().includes(normalizedQuery)
        );
      return matchesQuery && (statusFilter === "all" || r.status === statusFilter);
    });
  }, [query, statusFilter, requests]);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      reviewed: requests.filter((r) => r.status === "reviewed").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests]
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-surface/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold">
              Basta Manibela / Control room
            </p>
            <h1 className="mt-2 font-display text-4xl text-paper">Sell requests</h1>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-body text-xs uppercase tracking-widest text-muted">Incoming vehicles</p>
            <p className="mt-1 font-body text-sm text-silver">Review and respond to offers</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="flex items-center gap-2 border border-white/10 px-4 py-2 font-body text-xs text-muted transition-colors hover:border-gold/50 hover:text-gold-bright"
            >
              Inventory
            </a>
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
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats */}
        <div className="mb-8 grid gap-3 sm:grid-cols-5">
          {[
            ["Total", counts.total, "text-paper"],
            ["Pending", counts.pending, "text-amber-200"],
            ["Reviewed", counts.reviewed, "text-blue-200"],
            ["Accepted", counts.accepted, "text-emerald-300"],
            ["Rejected", counts.rejected, "text-muted"],
          ].map(([label, count, color]) => (
            <div key={label} className="border-l border-gold/50 bg-surface px-5 py-4">
              <p className="font-body text-[11px] uppercase tracking-widest text-muted">{label}</p>
              <p className={`mt-2 font-display text-3xl ${color}`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, brand, or model"
              className="w-full border border-white/10 bg-surface py-3 pl-10 pr-4 font-body text-sm text-paper placeholder:text-muted focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as SellRequestStatus | "all")}
                className="appearance-none border border-white/10 bg-surface py-3 pl-3 pr-9 font-body text-xs capitalize text-silver focus:border-gold focus:outline-none"
              >
                <option value="all" className="bg-surface">All statuses</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key} className="bg-surface">{config.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className="mt-5 flex items-center justify-between border border-gold/20 bg-gold/5 px-4 py-3 font-body text-sm text-gold-bright">
            <span>{notice}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setNotice("")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-muted">Loading requests...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="mt-6 overflow-x-auto border border-white/10 bg-surface">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr className="font-body text-[11px] uppercase tracking-widest text-muted">
                  <th className="px-5 py-4 font-normal">Seller</th>
                  <th className="px-5 py-4 font-normal">Vehicle</th>
                  <th className="px-5 py-4 font-normal">Asking Price</th>
                  <th className="px-5 py-4 font-normal">Condition</th>
                  <th className="px-5 py-4 font-normal">Status</th>
                  <th className="px-5 py-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="group transition-colors hover:bg-white/[0.025]">
                    <td className="px-5 py-4">
                      <p className="font-display text-lg text-paper">{req.name}</p>
                      <p className="mt-1 font-body text-xs text-muted">{req.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-silver">
                        {req.year} {req.brand} {req.model}
                      </p>
                      <p className="mt-1 font-body text-xs text-muted">{formatKm(req.mileageKm)}</p>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-gold-bright">
                      {formatPHP(req.askingPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-sm capitalize text-silver">{req.condition}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 border px-2 py-1 font-body text-[10px] uppercase tracking-wider ${STATUS_CONFIG[req.status].color}`}
                      >
                        {STATUS_CONFIG[req.status].icon}
                        {STATUS_CONFIG[req.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          aria-label={`View ${req.name}`}
                          className="border border-white/10 p-2 text-silver transition-colors hover:border-gold/50 hover:text-gold-bright"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <a
                          href={`tel:${req.phone}`}
                          aria-label={`Call ${req.name}`}
                          className="border border-white/10 p-2 text-silver transition-colors hover:border-emerald-400/50 hover:text-emerald-300"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <p className="px-5 py-14 text-center font-body text-sm text-muted">
                No sell requests match the current filters.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Detail Panel */}
      {selectedRequest && (
        <RequestDetailPanel
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

function RequestDetailPanel({
  request,
  onClose,
  onUpdateStatus,
}: {
  request: StoredSellRequest;
  onClose: () => void;
  onUpdateStatus: (id: string, status: SellRequestStatus) => void;
}) {
  const statusActions: { status: SellRequestStatus; label: string; color: string }[] = [
    { status: "reviewed", label: "Mark as Reviewed", color: "border-blue-400/50 text-blue-300 hover:bg-blue-400/10" },
    { status: "accepted", label: "Accept Offer", color: "border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10" },
    { status: "rejected", label: "Reject", color: "border-red-400/50 text-red-300 hover:bg-red-400/10" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111114] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold">Sell request</p>
            <h2 className="mt-2 font-display text-3xl text-paper">{request.name}</h2>
            <p className="mt-1 font-body text-sm text-muted">{request.phone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted transition-colors hover:text-paper"
          >
            <X />
          </button>
        </div>

        <div className="mt-7 space-y-6">
          {/* Vehicle Info */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-widest text-muted">Vehicle Details</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-muted">Brand / Make</p>
                <p className="mt-1 font-body text-sm text-paper">{request.brand}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted">Model</p>
                <p className="mt-1 font-body text-sm text-paper">{request.model}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted">Year</p>
                <p className="mt-1 font-body text-sm text-paper">{request.year}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted">Mileage</p>
                <p className="mt-1 font-body text-sm text-paper">{formatKm(request.mileageKm)}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted">Condition</p>
                <p className="mt-1 font-body text-sm capitalize text-paper">{request.condition}</p>
              </div>
              <div>
                <p className="font-body text-xs text-muted">Asking Price</p>
                <p className="mt-1 font-body text-sm text-gold-bright">{formatPHP(request.askingPrice)}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div>
              <p className="font-body text-[11px] uppercase tracking-widest text-muted">Additional Details</p>
              <p className="mt-3 font-body text-sm text-silver whitespace-pre-wrap">{request.message}</p>
            </div>
          )}

          {/* Status Actions */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-widest text-muted">Update Status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statusActions.map((action) => (
                <button
                  key={action.status}
                  type="button"
                  onClick={() => onUpdateStatus(request.id, action.status)}
                  className={`border px-4 py-2 font-body text-xs transition-colors ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-5">
            <a
              href={`tel:${request.phone}`}
              className="flex w-full items-center justify-center gap-2 border border-white/10 px-6 py-3 font-body text-sm text-silver transition-colors hover:border-gold/50 hover:text-gold-bright"
            >
              <Phone className="h-4 w-4" />
              Call {request.name}
            </a>
          </div>

          {/* Metadata */}
          <div className="border-t border-white/10 pt-5">
            <p className="font-body text-[10px] text-muted">
              Submitted: {new Date(request.createdAt).toLocaleString()}
            </p>
            <p className="font-body text-[10px] text-muted">
              Updated: {new Date(request.updatedAt).toLocaleString()}
            </p>
            <p className="font-body text-[10px] text-muted">ID: {request.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
