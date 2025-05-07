import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export function handleApiError(error: unknown, context: string): ApiErrorResponse {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      status: error.status,
      code: error.code
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: `${context}: ${error.message}`,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR'
    };
  }

  return {
    success: false,
    message: `${context}: An unexpected error occurred`,
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
}

export function createErrorResponse(error: ApiErrorResponse): NextResponse {
  return NextResponse.json(
    { error: error.message },
    { status: error.status }
  );
} 