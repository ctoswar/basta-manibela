import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { SellCarRequest } from "@/lib/types";

// File-based storage for sell requests (can be replaced with DB later)
const DATA_DIR = path.join(process.cwd(), "lib", "data");
const STORAGE_FILE = path.join(DATA_DIR, "sell-requests.json");

export interface StoredSellRequest extends SellCarRequest {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return `sell-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

async function readSellRequests(): Promise<StoredSellRequest[]> {
  try {
    if (!existsSync(STORAGE_FILE)) {
      return [];
    }
    const data = await readFile(STORAGE_FILE, "utf-8");
    return JSON.parse(data) as StoredSellRequest[];
  } catch {
    return [];
  }
}

async function writeSellRequests(requests: StoredSellRequest[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(STORAGE_FILE, JSON.stringify(requests, null, 2));
}

function validateSellCarRequest(data: unknown): {
  valid: boolean;
  errors: string[];
  parsed?: SellCarRequest;
} {
  const errors: string[] = [];
  const req = data as Partial<SellCarRequest>;

  if (!req.name || typeof req.name !== "string" || req.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!req.phone || typeof req.phone !== "string" || req.phone.trim().length === 0) {
    errors.push("Phone number is required");
  }

  if (!req.brand || typeof req.brand !== "string" || req.brand.trim().length === 0) {
    errors.push("Brand is required");
  }

  if (!req.model || typeof req.model !== "string" || req.model.trim().length === 0) {
    errors.push("Model is required");
  }

  if (!req.year || typeof req.year !== "number" || req.year < 1900 || req.year > new Date().getFullYear() + 1) {
    errors.push("Valid year is required");
  }

  if (req.mileageKm === undefined || typeof req.mileageKm !== "number" || req.mileageKm < 0) {
    errors.push("Valid mileage is required");
  }

  if (req.askingPrice === undefined || typeof req.askingPrice !== "number" || req.askingPrice < 0) {
    errors.push("Valid asking price is required");
  }

  const validConditions = ["excellent", "good", "fair", "poor"];
  if (!req.condition || !validConditions.includes(req.condition)) {
    errors.push("Valid condition is required (excellent, good, fair, or poor)");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    parsed: {
      name: req.name!.trim(),
      phone: req.phone!.trim(),
      brand: req.brand!.trim(),
      model: req.model!.trim(),
      year: req.year!,
      mileageKm: req.mileageKm!,
      askingPrice: req.askingPrice!,
      condition: req.condition!,
      message: req.message?.trim() || undefined,
    },
  };
}

// GET - List all sell requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let requests = await readSellRequests();

    // Filter by status if provided
    if (status && ["pending", "reviewed", "accepted", "rejected"].includes(status)) {
      requests = requests.filter((r) => r.status === status);
    }

    // Sort by creation date (newest first)
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: requests,
      total: requests.length,
    });
  } catch (error) {
    console.error("Error fetching sell requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sell requests" },
      { status: 500 }
    );
  }
}

// POST - Create new sell request
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let sellData: Partial<SellCarRequest>;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (with photos)
      const formData = await request.formData();
      sellData = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        brand: formData.get("brand") as string,
        model: formData.get("model") as string,
        year: Number(formData.get("year")),
        mileageKm: Number(formData.get("mileageKm")),
        askingPrice: Number(formData.get("askingPrice")),
        condition: formData.get("condition") as SellCarRequest["condition"],
        message: (formData.get("message") as string) || undefined,
      };

      // Note: Photo files are received but stored separately
      // For now, we just validate they exist. In production,
      // upload to cloud storage (Supabase/Cloudinary) and store URLs.
      const photos: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (key === "photos" && value instanceof File) {
          photos.push(value);
        }
      }

      // Store photo count in message for now
      if (photos.length > 0) {
        const photoNote = `[${photos.length} photo(s) attached]`;
        sellData.message = sellData.message
          ? `${sellData.message}\n${photoNote}`
          : photoNote;
      }
    } else {
      // Handle JSON
      sellData = await request.json();
    }

    // Validate the request
    const validation = validateSellCarRequest(sellData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(". ") },
        { status: 400 }
      );
    }

    // Create stored request with metadata
    const now = new Date().toISOString();
    const storedRequest: StoredSellRequest = {
      ...validation.parsed!,
      id: generateId(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    // Save to file
    const requests = await readSellRequests();
    requests.push(storedRequest);
    await writeSellRequests(requests);

    return NextResponse.json({
      success: true,
      message: "We received your vehicle details. Our team will review and get back to you with an offer.",
      id: storedRequest.id,
    });
  } catch (error) {
    console.error("Error processing sell car request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
