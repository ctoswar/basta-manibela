export type VehicleType = "car" | "motorcycle" | "suv" | "truck";
export type Transmission = "automatic" | "manual";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric";

export interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  price: number; // in PHP
  mileageKm: number;
  transmission: Transmission;
  fuelType: FuelType;
  color: string;
  location: string;
  description: string;
  images: string[];
  featured: boolean;
  status: "available" | "reserved" | "sold";
  createdAt: string; // ISO date
}

export interface VehicleFilters {
  type?: VehicleType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

export interface ReservationRequest {
  vehicleId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
