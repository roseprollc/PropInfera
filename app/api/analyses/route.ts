import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type {
  Analysis,
  CalculatorType,
  AnalysisResults,
  AnalysisResultsMap,
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

// Incoming request structure with correct type safety
interface IncomingSaveAnalysisRequest<T extends CalculatorType = CalculatorType> {
  userId: string;
  type: T;
  title?: string;
  notes?: string;
  data: AnalysisResultsMap[T];
  createdAt?: Date;
  updatedAt?: Date;
}

// GET handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db("propinfera");
    const collection = db.collection<Analysis>("analyses");

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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as IncomingSaveAnalysisRequest;
    const { userId, type, data, title, notes } = body;

    const missingFields = ["userId", "type", "data"].filter((field) => !(field === "userId" ? userId : field === "type" ? type : data));
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: missingFields
        },
        { status: 400 }
      );
    }

    let validatedData: AnalysisResultsMap[typeof type];

    switch (type) {
      case "mortgage":
        if (!isMortgageResults(data as AnalysisResults)) return invalidTypeResponse();
        validatedData = data as MortgageAnalysisResults;
        break;
      case "rental":
        if (!isRentalResults(data as AnalysisResults)) return invalidTypeResponse();
        validatedData = data as RentalAnalysisResults;
        break;
      case "airbnb":
        if (!isAirbnbResults(data as AnalysisResults)) return invalidTypeResponse();
        validatedData = data as AirbnbAnalysisResults;
        break;
      case "wholesale":
        if (!isWholesaleResults(data as AnalysisResults)) return invalidTypeResponse();
        validatedData = data as WholesaleAnalysisResults;
        break;
      case "renters":
        if (!isRentersResults(data as AnalysisResults)) return invalidTypeResponse();
        validatedData = data as RentersAnalysisResults;
        break;
      default:
        return invalidTypeResponse();
    }

    const client = await clientPromise;
    const db = client.db("propinfera");
    const collection = db.collection<Analysis<typeof type>>("analyses");

    const newAnalysis: Analysis<typeof type> = {
      userId,
      type,
      title: title || "Untitled Analysis",
      notes: notes || "",
      data: validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
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

function invalidTypeResponse() {
  return NextResponse.json(
    {
      error: "Invalid analysis type or mismatched data structure",
      details: "Ensure 'type' matches the shape of 'data'"
    },
    { status: 400 }
  );
}
