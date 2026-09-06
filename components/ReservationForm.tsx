"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { submitReservation } from "@/lib/api/listings";
import { SALES_AGENTS } from "@/lib/types";

export default function ReservationForm({ vehicleId }: { vehicleId: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agentId, setAgentId] = useState("");
  const [message, setMessage] = useState("");
  const [agentOpen, setAgentOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAgentOpen(false);
      }
    }
    if (agentOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [agentOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await submitReservation({ vehicleId, name, phone, agentId, message });
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

      <div className="block">
        <span className="font-body text-xs text-muted">Preferred sales agent (optional)</span>
        <div ref={dropdownRef} className="relative mt-1">
          <button
            type="button"
            onClick={() => setAgentOpen(!agentOpen)}
            className="flex w-full items-center justify-between border-b border-white/20 bg-transparent py-2 font-body text-left text-paper transition-colors hover:border-white/30 focus:border-gold focus:outline-none"
          >
            <span>
              {!agentId ? (
                "No preference"
              ) : (
                <>
                  <span>{SALES_AGENTS.find((a) => a.id === agentId)?.name}</span>
                  {SALES_AGENTS.find((a) => a.id === agentId)?.specialization && (
                    <span className="ml-2 text-sm text-muted">
                      — {SALES_AGENTS.find((a) => a.id === agentId)?.specialization}
                    </span>
                  )}
                </>
              )}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform duration-300 ease-out ${
                agentOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown panel */}
          <div
            className={`absolute z-20 mt-1 w-full overflow-hidden border border-white/10 bg-surface shadow-xl transition-all duration-300 ease-out ${
              agentOpen
                ? "max-h-60 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="py-1">
              {/* No preference option */}
              <button
                type="button"
                onClick={() => {
                  setAgentId("");
                  setAgentOpen(false);
                }}
                className={`flex w-full flex-col px-4 py-2.5 text-left font-body transition-all duration-200 ${
                  !agentId
                    ? "bg-gold/10 text-gold-bright"
                    : "text-silver hover:bg-white/5 hover:text-paper"
                }`}
                style={{
                  transitionDelay: agentOpen ? "0ms" : "0ms",
                }}
              >
                <span className="text-sm">No preference</span>
                <span className="text-xs text-muted">Assign any available agent</span>
              </button>

              {SALES_AGENTS.map((agent, i) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setAgentId(agent.id);
                    setAgentOpen(false);
                  }}
                  className={`flex w-full flex-col px-4 py-2.5 text-left font-body transition-all duration-200 ${
                    agentId === agent.id
                      ? "bg-gold/10 text-gold-bright"
                      : "text-silver hover:bg-white/5 hover:text-paper"
                  }`}
                  style={{
                    transitionDelay: agentOpen ? `${(i + 1) * 40}ms` : "0ms",
                  }}
                >
                  <span className="text-sm">{agent.name}</span>
                  {agent.specialization && (
                    <span className="text-xs text-muted">{agent.specialization}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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
