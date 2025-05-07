import { NextRequest, NextResponse } from 'next/server';
import { saveReportToDB } from '@/lib/services/saveReport';
import { handleApiError, createErrorResponse, ValidationError } from '@/lib/utils/handleApiError';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data) {
      throw new ValidationError('Request body is required');
    }

    const result = await saveReportToDB(data);

    if (!result.success) {
      return createErrorResponse(result);
    }

    return NextResponse.json(result);
  } catch (error) {
    const errorResponse = handleApiError(error, 'Failed to save report');
    return createErrorResponse(errorResponse);
  }
} 