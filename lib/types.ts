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

export interface SalesAgent {
  id: string;
  name: string;
  specialization?: string;
}

export const SALES_AGENTS: SalesAgent[] = [
  { id: "agent-1", name: "Carlo Reyes", specialization: "SUVs & Trucks" },
  { id: "agent-2", name: "Ana Santos", specialization: "Sedans & Compact Cars" },
  { id: "agent-3", name: "Miguel Cruz", specialization: "Motorcycles" },
  { id: "agent-4", name: "Priya Mendoza", specialization: "Financing & Trade-ins" },
];

export interface ReservationRequest {
  vehicleId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  agentId?: string;
}

export type CarCondition = "excellent" | "good" | "fair" | "poor";

export interface SellCarRequest {
  name: string;
  phone: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  condition: CarCondition;
  message?: string;
  photos?: File[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
