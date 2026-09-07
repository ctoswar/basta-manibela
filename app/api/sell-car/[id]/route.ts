import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { SellCarRequest } from "@/lib/types";

// File-based storage for sell requests (can be replaced with DB later)
const DATA_DIR = path.join(process.cwd(), "lib", "data");
const STORAGE_FILE = path.join(DATA_DIR, "sell-requests.json");

interface StoredSellRequest extends SellCarRequest {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
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

// PATCH - Update sell request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Valid status is required (pending, reviewed, accepted, rejected)" },
        { status: 400 }
      );
    }

    // Read existing requests
    const requests = await readSellRequests();
    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Sell request not found" },
        { status: 404 }
      );
    }

    // Update status
    requests[index].status = status;
    requests[index].updatedAt = new Date().toISOString();

    // Save changes
    await writeSellRequests(requests);

    return NextResponse.json({
      success: true,
      message: `Sell request status updated to ${status}`,
      data: requests[index],
    });
  } catch (error) {
    console.error("Error updating sell request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update sell request" },
      { status: 500 }
    );
  }
}

// GET - Get single sell request by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const requests = await readSellRequests();
    const found = requests.find((r) => r.id === id);

    if (!found) {
      return NextResponse.json(
        { success: false, message: "Sell request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: found,
    });
  } catch (error) {
    console.error("Error fetching sell request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sell request" },
      { status: 500 }
    );
  }
}
