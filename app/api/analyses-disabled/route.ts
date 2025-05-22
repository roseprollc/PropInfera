import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type {
  Analysis,
  CalculatorType,
  AnalysisResults,
  MortgageAnalysisResults,
  RentalAnalysisResults,
  AirbnbAnalysisResults,
  WholesaleAnalysisResults,
  RentersAnalysisResults
} from "@/types/analysis";
import {
  isMortgageResults,
  isRentalResults,
  isAirbnbResults,
  isWholesaleResults,
  isRentersResults
} from "@/types/analysis";

// Base request structure with typed data field
interface IncomingSaveAnalysisBase {
  userId: string;
  type: CalculatorType;
  title?: string;
  notes?: string;
  data: AnalysisResults;
}

// Constants for validation
const MAX_TITLE_LENGTH = 100;
const MAX_NOTES_LENGTH = 1000;

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

// Helper function to sanitize text
function sanitizeText(text: string): string {
  return text.trim().replace(/[<>]/g, '');
}

// GET handler
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId && !isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("propinfera");
    const collection = db.collection<Analysis<CalculatorType>>("analyses");

    const query = userId ? { userId } : {};
    const analyses = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      data: analyses,
      message: `Found ${analyses.length} analyses`
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analyses",
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as IncomingSaveAnalysisBase;
    const { userId, type, data, title, notes } = body;

    // Validate userId format
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const missingFields = ["userId", "type", "data"].filter((field) => !body[field as keyof typeof body]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: missingFields
        },
        { status: 400 }
      );
    }

    // Validate and sanitize title and notes
    const sanitizedTitle = title ? sanitizeText(title) : "Untitled Analysis";
    const sanitizedNotes = notes ? sanitizeText(notes) : "";

    if (sanitizedTitle.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `Title must be less than ${MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (sanitizedNotes.length > MAX_NOTES_LENGTH) {
      return NextResponse.json(
        { error: `Notes must be less than ${MAX_NOTES_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Validate type and cast safely
    let validatedData: AnalysisResults;
    let metrics = { roi: 0, cashFlow: 0, capRate: 0 };
    switch (type) {
      case "mortgage":
        if (!isMortgageResults(data)) return invalidTypeResponse();
        validatedData = data as MortgageAnalysisResults;
        metrics = { roi: 0, cashFlow: 0, capRate: 0 };
        break;
      case "rental":
        if (!isRentalResults(data)) return invalidTypeResponse();
        validatedData = data as RentalAnalysisResults;
        metrics = {
          roi: validatedData.roi ?? 0,
          cashFlow: validatedData.cashFlow ?? 0,
          capRate: validatedData.capRate ?? 0
        };
        break;
      case "airbnb":
        if (!isAirbnbResults(data)) return invalidTypeResponse();
        validatedData = data as AirbnbAnalysisResults;
        metrics = {
          roi: (validatedData as any).roi ?? 0,
          cashFlow: (validatedData as any).cashFlow ?? 0,
          capRate: (validatedData as any).capRate ?? 0
        };
        break;
      case "wholesale":
        if (!isWholesaleResults(data)) return invalidTypeResponse();
        validatedData = data as WholesaleAnalysisResults;
        metrics = {
          roi: validatedData.returnOnInvestment ?? 0,
          cashFlow: 0,
          capRate: 0
        };
        break;
      case "renters":
        if (!isRentersResults(data)) return invalidTypeResponse();
        validatedData = data as RentersAnalysisResults;
        metrics = {
          roi: validatedData.roi ?? 0,
          cashFlow: validatedData.cashFlow ?? 0,
          capRate: validatedData.capRate ?? 0
        };
        break;
      default:
        return invalidTypeResponse();
    }

    const client = await clientPromise;
    const db = client.db("propinfera");
    const collection = db.collection<Analysis<CalculatorType>>("analyses");

    const newAnalysis: Analysis<CalculatorType> = {
      userId,
      type,
      title: sanitizedTitle,
      notes: sanitizedNotes,
      data: validatedData as any,
      metrics,
      mode: type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newAnalysis);

    return NextResponse.json(
      {
        data: { ...newAnalysis, _id: result.insertedId },
        message: "Analysis saved successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving analysis:", error);
    return NextResponse.json(
      {
        error: "Failed to save analysis",
        details: error instanceof Error ? error.message : error
      },
      { status: 500 }
    );
  }
}

// Helper response for type mismatches
function invalidTypeResponse() {
  return NextResponse.json(
    {
      error: "Invalid analysis type or mismatched data structure",
      details: "Ensure 'type' matches the shape of 'data'"
    },
    { status: 400 }
  );
}
