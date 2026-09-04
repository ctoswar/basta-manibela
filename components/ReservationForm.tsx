"use client";

import { useState } from "react";
import { submitReservation } from "@/lib/api/listings";

export default function ReservationForm({ vehicleId }: { vehicleId: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await submitReservation({ vehicleId, name, phone, message });
      setStatus(res.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/40 bg-surface p-6">
        <p className="font-body text-gold-bright">
          Request sent. The team will reach out on the number you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-white/10 bg-surface p-6">
      <h3 className="font-display text-xl text-paper">Reserve or ask about this vehicle</h3>

      <label className="block">
        <span className="font-body text-xs text-muted">Full name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-body text-xs text-muted">Phone number</span>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-body text-xs text-muted">Message (optional)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-sm bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send request"}
      </button>

      {status === "error" && (
        <p className="font-body text-sm text-red-400">
          Something went wrong. Please try again or message us directly.
        </p>
      )}
    </form>
  );
}
