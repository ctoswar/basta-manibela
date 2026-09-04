"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import vehiclesData from "@/lib/data/vehicles.json";
import type { FuelType, Transmission, Vehicle, VehicleType } from "@/lib/types";
import { formatPHP, formatKm } from "@/lib/format";

const STORAGE_KEY = "basta-manibela:admin-vehicles";
const vehicleTypes: VehicleType[] = ["car", "suv", "truck", "motorcycle"];
const transmissions: Transmission[] = ["automatic", "manual"];
const fuelTypes: FuelType[] = ["gasoline", "diesel", "hybrid", "electric"];
const statuses: Vehicle["status"][] = ["available", "reserved", "sold"];

type VehicleForm = Omit<Vehicle, "id" | "createdAt">;

const emptyForm: VehicleForm = {
  title: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  type: "car",
  price: 0,
  mileageKm: 0,
  transmission: "automatic",
  fuelType: "gasoline",
  color: "",
  location: "Lipa City, Batangas",
  description: "",
  images: [""],
  featured: false,
  status: "available",
};

function readVehicles(): Vehicle[] {
  if (typeof window === "undefined") return vehiclesData as Vehicle[];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return vehiclesData as Vehicle[];
  try {
    return JSON.parse(stored) as Vehicle[];
  } catch {
    return vehiclesData as Vehicle[];
  }
}

function makeId() {
  return `v${Date.now().toString(36)}`;
}

function statusTone(status: Vehicle["status"]) {
  return {
    available: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    reserved: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    sold: "border-white/10 bg-white/5 text-muted",
  }[status];
}

export default function AdminInventory() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Vehicle["status"] | "all">("all");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => setVehicles(readVehicles()), []);

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesQuery =
        !normalizedQuery ||
        [vehicle.title, vehicle.brand, vehicle.model].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );
      return (
        matchesQuery &&
        (statusFilter === "all" || vehicle.status === statusFilter) &&
        (typeFilter === "all" || vehicle.type === typeFilter)
      );
    });
  }, [query, statusFilter, typeFilter, vehicles]);

  const counts = useMemo(
    () => ({
      total: vehicles.length,
      available: vehicles.filter((vehicle) => vehicle.status === "available").length,
      reserved: vehicles.filter((vehicle) => vehicle.status === "reserved").length,
      sold: vehicles.filter((vehicle) => vehicle.status === "sold").length,
    }),
    [vehicles]
  );

  function persist(next: Vehicle[]) {
    setVehicles(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function startCreate() {
    setSelectedId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function startEdit(vehicle: Vehicle) {
    const { id: _id, createdAt: _createdAt, ...editable } = vehicle;
    setSelectedId(vehicle.id);
    setForm(editable);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedId(null);
  }

  function updateField<K extends keyof VehicleForm>(field: K, value: VehicleForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanForm = {
      ...form,
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      images: form.images.filter((image) => image.trim()),
    };
    if (!cleanForm.title || !cleanForm.brand || !cleanForm.model || cleanForm.images.length === 0) {
      setNotice("Add a title, brand, model, and image before saving.");
      return;
    }

    const nextVehicle: Vehicle = {
      ...cleanForm,
      id: selectedId ?? makeId(),
      createdAt: selectedId
        ? vehicles.find((vehicle) => vehicle.id === selectedId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
    };
    const next = selectedId
      ? vehicles.map((vehicle) => (vehicle.id === selectedId ? nextVehicle : vehicle))
      : [nextVehicle, ...vehicles];
    persist(next);
    setNotice(selectedId ? "Vehicle details updated." : "Vehicle added to inventory.");
    closeForm();
  }

  function deleteVehicle(vehicle: Vehicle) {
    if (!window.confirm(`Remove ${vehicle.title} from inventory?`)) return;
    persist(vehicles.filter((item) => item.id !== vehicle.id));
    setNotice("Vehicle removed from inventory.");
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-white/10 bg-surface/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold">
              Basta Manibela / Control room
            </p>
            <h1 className="mt-2 font-display text-4xl text-paper">Inventory desk</h1>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-body text-xs uppercase tracking-widest text-muted">Local workspace</p>
            <p className="mt-1 font-body text-sm text-silver">Changes saved on this device</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 grid gap-3 sm:grid-cols-4">
          {[
            ["Total stock", counts.total, "text-paper"],
            ["Available", counts.available, "text-emerald-300"],
            ["Reserved", counts.reserved, "text-amber-200"],
            ["Sold", counts.sold, "text-muted"],
          ].map(([label, count, color]) => (
            <div key={label} className="border-l border-gold/50 bg-surface px-5 py-4">
              <p className="font-body text-[11px] uppercase tracking-widest text-muted">{label}</p>
              <p className={`mt-2 font-display text-3xl ${color}`}>{count}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, brand, or model"
              className="w-full border border-white/10 bg-surface py-3 pl-10 pr-4 font-body text-sm text-paper placeholder:text-muted focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect value={typeFilter} onChange={(value) => setTypeFilter(value as VehicleType | "all")} options={["all", ...vehicleTypes]} />
            <FilterSelect value={statusFilter} onChange={(value) => setStatusFilter(value as Vehicle["status"] | "all")} options={["all", ...statuses]} />
            <button type="button" onClick={startCreate} className="flex items-center gap-2 bg-gold px-4 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright">
              <Plus className="h-4 w-4" /> Add vehicle
            </button>
          </div>
        </div>

        {notice && (
          <div className="mt-5 flex items-center justify-between border border-gold/20 bg-gold/5 px-4 py-3 font-body text-sm text-gold-bright">
            <span>{notice}</span>
            <button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="mt-6 overflow-x-auto border border-white/10 bg-surface">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr className="font-body text-[11px] uppercase tracking-widest text-muted">
                <th className="px-5 py-4 font-normal">Vehicle</th>
                <th className="px-5 py-4 font-normal">Type</th>
                <th className="px-5 py-4 font-normal">Price</th>
                <th className="px-5 py-4 font-normal">Status</th>
                <th className="px-5 py-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="group transition-colors hover:bg-white/[0.025]">
                  <td className="px-5 py-4">
                    <p className="font-display text-lg text-paper">{vehicle.title}</p>
                    <p className="mt-1 font-body text-xs text-muted">{vehicle.year} · {formatKm(vehicle.mileageKm)} · {vehicle.location}</p>
                  </td>
                  <td className="px-5 py-4 font-body text-sm capitalize text-silver">{vehicle.type}</td>
                  <td className="px-5 py-4 font-body text-sm text-gold-bright">{formatPHP(vehicle.price)}</td>
                  <td className="px-5 py-4"><span className={`inline-flex border px-2 py-1 font-body text-[10px] uppercase tracking-wider ${statusTone(vehicle.status)}`}>{vehicle.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => startEdit(vehicle)} aria-label={`Edit ${vehicle.title}`} className="border border-white/10 p-2 text-silver transition-colors hover:border-gold/50 hover:text-gold-bright"><Edit3 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => deleteVehicle(vehicle)} aria-label={`Delete ${vehicle.title}`} className="border border-white/10 p-2 text-silver transition-colors hover:border-red-400/50 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVehicles.length === 0 && <p className="px-5 py-14 text-center font-body text-sm text-muted">No vehicles match the current filters.</p>}
        </div>
      </main>

      {isFormOpen && <VehicleFormPanel form={form} selectedId={selectedId} onChange={updateField} onClose={closeForm} onSubmit={handleSubmit} />}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none border border-white/10 bg-surface py-3 pl-3 pr-9 font-body text-xs capitalize text-silver focus:border-gold focus:outline-none">
        {options.map((option) => <option key={option} value={option} className="bg-surface">{option === "all" ? "All" : option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
    </div>
  );
}

function VehicleFormPanel({
  form,
  selectedId,
  onChange,
  onClose,
  onSubmit,
}: {
  form: VehicleForm;
  selectedId: string | null;
  onChange: <K extends keyof VehicleForm>(field: K, value: VehicleForm[K]) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111114] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold">{selectedId ? "Edit listing" : "New listing"}</p>
            <h2 className="mt-2 font-display text-3xl text-paper">{selectedId ? "Update vehicle" : "Add a vehicle"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="text-muted transition-colors hover:text-paper"><X /></button>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Listing title" value={form.title} onChange={(value) => onChange("title", value)} required className="sm:col-span-2" />
          <Field label="Brand" value={form.brand} onChange={(value) => onChange("brand", value)} required />
          <Field label="Model" value={form.model} onChange={(value) => onChange("model", value)} required />
          <NumberField label="Year" value={form.year} onChange={(value) => onChange("year", value)} />
          <NumberField label="Price (PHP)" value={form.price} onChange={(value) => onChange("price", value)} />
          <NumberField label="Mileage (km)" value={form.mileageKm} onChange={(value) => onChange("mileageKm", value)} />
          <SelectField label="Type" value={form.type} options={vehicleTypes} onChange={(value) => onChange("type", value as VehicleType)} />
          <SelectField label="Status" value={form.status} options={statuses} onChange={(value) => onChange("status", value as Vehicle["status"])} />
          <SelectField label="Transmission" value={form.transmission} options={transmissions} onChange={(value) => onChange("transmission", value as Transmission)} />
          <SelectField label="Fuel type" value={form.fuelType} options={fuelTypes} onChange={(value) => onChange("fuelType", value as FuelType)} />
          <Field label="Color" value={form.color} onChange={(value) => onChange("color", value)} />
          <Field label="Location" value={form.location} onChange={(value) => onChange("location", value)} />
          <Field label="Image URL" value={form.images[0] ?? ""} onChange={(value) => onChange("images", [value])} required className="sm:col-span-2" />
          <label className="flex items-center gap-3 font-body text-sm text-silver sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={(event) => onChange("featured", event.target.checked)} className="h-4 w-4 accent-gold" /> Feature this vehicle on the homepage
          </label>
          <label className="block sm:col-span-2">
            <span className="font-body text-xs text-muted">Description</span>
            <textarea required value={form.description} onChange={(event) => onChange("description", event.target.value)} rows={4} className="mt-1 w-full resize-none border border-white/10 bg-surface px-3 py-2 font-body text-sm text-paper focus:border-gold focus:outline-none" />
          </label>
        </div>
        <button type="submit" className="mt-8 flex w-full items-center justify-center gap-2 bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright"><Check className="h-4 w-4" /> {selectedId ? "Save changes" : "Create listing"}</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required = false, className = "" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; className?: string }) {
  return <label className={`block ${className}`}><span className="font-body text-xs text-muted">{label}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full border border-white/10 bg-surface px-3 py-2 font-body text-sm text-paper focus:border-gold focus:outline-none" /></label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block"><span className="font-body text-xs text-muted">{label}</span><input type="number" min={0} required value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full border border-white/10 bg-surface px-3 py-2 font-body text-sm text-paper focus:border-gold focus:outline-none" /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block"><span className="font-body text-xs text-muted">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full border border-white/10 bg-surface px-3 py-2 font-body text-sm capitalize text-paper focus:border-gold focus:outline-none">{options.map((option) => <option key={option} value={option} className="bg-surface">{option}</option>)}</select></label>;
}
