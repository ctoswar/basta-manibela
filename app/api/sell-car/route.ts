import { NextRequest, NextResponse } from "next/server";
import type { SellCarRequest } from "@/lib/types";

// File-based storage for sell requests (can be replaced with DB later)
const STORAGE_KEY = "basta-manibela:sell-requests";

interface StoredSellRequest extends SellCarRequest {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

function generateId(): string {
  return `sell-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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
    const storedRequest: StoredSellRequest = {
      ...validation.parsed!,
      id: generateId(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store the request (in production, save to database)
    // For now, we log it. In a real implementation:
    // - Save to database
    // - Send notification to dealership
    // - Queue for admin review
    console.log("Sell car request received:", storedRequest);

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

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
