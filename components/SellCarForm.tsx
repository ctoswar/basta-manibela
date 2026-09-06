"use client";

import { useState } from "react";
import { submitSellCar } from "@/lib/api/listings";
import type { CarCondition } from "@/lib/types";

const CONDITIONS: { value: CarCondition; label: string }[] = [
  { value: "excellent", label: "Excellent — like new, no issues" },
  { value: "good", label: "Good — minor wear, runs well" },
  { value: "fair", label: "Fair — some repairs needed" },
  { value: "poor", label: "Poor — significant issues" },
];

export default function SellCarForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileageKm, setMileageKm] = useState("");
  const [condition, setCondition] = useState<CarCondition>("good");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await submitSellCar({
        name,
        phone,
        brand,
        model,
        year: Number(year),
        mileageKm: Number(mileageKm),
        condition,
        message,
      });
      setStatus(res.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/40 bg-surface p-6">
        <p className="font-body text-gold-bright">
          Vehicle details received. Our team will review and contact you with an offer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-white/10 bg-surface p-6">
      <h3 className="font-display text-xl text-paper">Sell your car to us</h3>
      <p className="font-body text-sm text-muted">
        Tell us about your vehicle and we&apos;ll get back to you with an offer.
      </p>

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

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-body text-xs text-muted">Brand / Make</span>
          <input
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Toyota"
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper placeholder:text-muted/50 focus:border-gold focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="font-body text-xs text-muted">Model</span>
          <input
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Vios"
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper placeholder:text-muted/50 focus:border-gold focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-body text-xs text-muted">Year</span>
          <input
            required
            type="number"
            min="1900"
            max="2099"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2020"
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper placeholder:text-muted/50 focus:border-gold focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="font-body text-xs text-muted">Mileage (km)</span>
          <input
            required
            type="number"
            min="0"
            value={mileageKm}
            onChange={(e) => setMileageKm(e.target.value)}
            placeholder="e.g. 35000"
            className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper placeholder:text-muted/50 focus:border-gold focus:outline-none"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-body text-xs text-muted">Condition</span>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as CarCondition)}
          className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper focus:border-gold focus:outline-none"
        >
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value} className="bg-surface text-paper">
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="font-body text-xs text-muted">Additional details (optional)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Any issues, modifications, or notes about the vehicle"
          className="mt-1 w-full border-b border-white/20 bg-transparent py-2 font-body text-paper placeholder:text-muted/50 focus:border-gold focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-sm bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit vehicle details"}
      </button>

      {status === "error" && (
        <p className="font-body text-sm text-red-400">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}
    </form>
  );
}
