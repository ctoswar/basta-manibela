import type { Vehicle, VehicleFilters, ReservationRequest } from "@/lib/types";
import vehiclesData from "@/lib/data/vehicles.json";

// --- MOCK IMPLEMENTATION ---------------------------------------------------
// Every exported function here is written as if it were hitting a real API:
// it's async, it can throw, and it returns exactly the shape a real endpoint
// would return. When the backend is ready, replace the body of each function
// with a `fetch(...)` call — nothing in the components needs to change.
// ----------------------------------------------------------------------------

const MOCK_LATENCY_MS = 250;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const ALL_VEHICLES = vehiclesData as Vehicle[];

export async function getListings(filters?: VehicleFilters): Promise<Vehicle[]> {
  let results = [...ALL_VEHICLES];

  if (filters?.type) {
    results = results.filter((v) => v.type === filters.type);
  }
  if (filters?.brand) {
    results = results.filter(
      (v) => v.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((v) => v.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((v) => v.price <= filters.maxPrice!);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }

  return delay(results);
}

export async function getFeaturedListings(): Promise<Vehicle[]> {
  return delay(ALL_VEHICLES.filter((v) => v.featured && v.status === "available"));
}

export async function getListingById(id: string): Promise<Vehicle | null> {
  const found = ALL_VEHICLES.find((v) => v.id === id) ?? null;
  return delay(found);
}

export async function getListingsByIds(ids: string[]): Promise<Vehicle[]> {
  if (ids.length === 0) return delay([]);
  const idSet = new Set(ids);
  const results = ALL_VEHICLES.filter((v) => idSet.has(v.id));
  return delay(results);
}

export async function submitReservation(
  req: ReservationRequest
): Promise<{ success: boolean; message: string }> {
  // Real implementation later: POST to /api/reservations, save to DB,
  // notify the dealership via email/Messenger webhook.
  console.log("Reservation submitted (mock):", req);
  return delay({
    success: true,
    message: "We received your request. The team will reach out shortly.",
  });
}

// --- FAVORITES ---------------------------------------------------------
// For now, favorites live in localStorage via the useFavorites hook.
// Once accounts exist, swap these for calls to /api/favorites tied to
// the logged-in user's id.
