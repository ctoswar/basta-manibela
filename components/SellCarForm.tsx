"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, ChevronDown } from "lucide-react";
import { submitSellCar } from "@/lib/api/listings";
import type { CarCondition } from "@/lib/types";

const CONDITIONS: { value: CarCondition; label: string; desc: string }[] = [
  { value: "excellent", label: "Excellent", desc: "Like new, no issues" },
  { value: "good", label: "Good", desc: "Minor wear, runs well" },
  { value: "fair", label: "Fair", desc: "Some repairs needed" },
  { value: "poor", label: "Poor", desc: "Significant issues" },
];

const MAX_PHOTOS = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [conditionOpen, setConditionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setConditionOpen(false);
      }
    }
    if (conditionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [conditionOpen]);

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPhotoError("");

    const valid = files.filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setPhotoError("Only JPEG, PNG, and WebP images are allowed.");
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        setPhotoError("Each image must be under 10MB.");
        return false;
      }
      return true;
    });

    setPhotos((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_PHOTOS) {
        setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed.`);
        return combined.slice(0, MAX_PHOTOS);
      }
      return combined;
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

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
        photos: photos.length > 0 ? photos : undefined,
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

      <div className="block">
        <span className="font-body text-xs text-muted">Condition</span>
        <div ref={dropdownRef} className="relative mt-1">
          <button
            type="button"
            onClick={() => setConditionOpen(!conditionOpen)}
            className="flex w-full items-center justify-between border-b border-white/20 bg-transparent py-2 font-body text-left text-paper transition-colors hover:border-white/30 focus:border-gold focus:outline-none"
          >
            <span>
              <span>{CONDITIONS.find((c) => c.value === condition)?.label}</span>
              <span className="ml-2 text-sm text-muted">
                — {CONDITIONS.find((c) => c.value === condition)?.desc}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform duration-300 ease-out ${
                conditionOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown panel */}
          <div
            className={`absolute z-20 mt-1 w-full overflow-hidden border border-white/10 bg-surface shadow-xl transition-all duration-300 ease-out ${
              conditionOpen
                ? "max-h-60 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="py-1">
              {CONDITIONS.map((c, i) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setCondition(c.value);
                    setConditionOpen(false);
                  }}
                  className={`flex w-full flex-col px-4 py-2.5 text-left font-body transition-all duration-200 ${
                    condition === c.value
                      ? "bg-gold/10 text-gold-bright"
                      : "text-silver hover:bg-white/5 hover:text-paper"
                  }`}
                  style={{
                    transitionDelay: conditionOpen ? `${i * 40}ms` : "0ms",
                  }}
                >
                  <span className="text-sm">{c.label}</span>
                  <span className="text-xs text-muted">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {/* Photo upload */}
      <div>
        <span className="font-body text-xs text-muted">
          Photos of your vehicle (optional — up to {MAX_PHOTOS})
        </span>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotosChange}
            className="hidden"
            id="sell-car-photos"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= MAX_PHOTOS}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-white/20 bg-white/[0.02] px-4 py-6 font-body text-sm text-muted transition-colors hover:border-gold/40 hover:text-silver disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Camera className="h-4 w-4" />
            {photos.length >= MAX_PHOTOS ? "Max photos reached" : "Click to upload photos"}
          </button>
        </div>

        {photoError && (
          <p className="mt-1 font-body text-xs text-red-400">{photoError}</p>
        )}

        {photos.length > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {photos.map((file, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg/80 text-muted opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
