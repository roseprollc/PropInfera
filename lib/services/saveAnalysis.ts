import { Analysis, CalculatorInputs, AnalysisResults, CalculatorType } from '@/types/analysis';

// API URL from environment variables with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Timeout for fetch requests in milliseconds
const FETCH_TIMEOUT = 10000;

// Maximum number of retry attempts
const MAX_RETRIES = 3;

export interface SaveAnalysisParams {
  userId: string;
  type: Analysis<CalculatorType>['type']; // Use the type property from Analysis with correct type constraint
  inputs: CalculatorInputs;
  results: AnalysisResults;
  title?: string;
  notes?: string;
}

export interface SaveAnalysisResponse {
  success: boolean;
  message: string;
  analysisId?: string;
  error?: string;
  errorCode?: string;
}

// Main function to save analysis with retry capability
export async function saveAnalysis(params: SaveAnalysisParams): Promise<SaveAnalysisResponse> {
  // Validate required fields
  if (!params.userId) {
    return {
      success: false,
      message: 'User ID is required',
      errorCode: 'MISSING_USER_ID'
    };
  }
  
  if (!params.type) {
    return {
      success: false,
      message: 'Analysis type is required',
      errorCode: 'MISSING_TYPE'
    };
  }
  
  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const endpoint = `${API_URL}/analyses`;
      
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
        FETCH_TIMEOUT
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || `Failed to save analysis (status: ${response.status})`;
        
        // Handle specific error codes
        if (response.status === 401) {
          return {
            success: false,
            message: 'Authentication required',
            errorCode: 'UNAUTHORIZED'
          };
        } else if (response.status === 403) {
          return {
            success: false,
            message: 'Permission denied',
            errorCode: 'FORBIDDEN'
          };
        } else if (response.status === 429) {
          // Rate limiting - retry after a delay
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        } else {
          throw new Error(errorMessage);
        }
      }
      
      return {
        success: true,
        message: 'Analysis saved successfully',
        analysisId: data.analysisId
      };
    } catch (error) {
      // Network errors or timeouts can be retried
      if (
        error instanceof Error && 
        (error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('network'))
      ) {
        retryCount++;
        
        if (retryCount < MAX_RETRIES) {
          // Exponential backoff for retry
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          continue;
        }
      }
      
      console.error('Error saving analysis:', error);
      return {
        success: false,
        message: 'Failed to save analysis',
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: error instanceof Error ? error.name : 'UNKNOWN_ERROR'
      };
    }
  }
  
  return {
    success: false,
    message: 'Failed to save analysis after multiple attempts',
    errorCode: 'MAX_RETRIES_EXCEEDED'
  };
}

// Fetch with timeout functionality
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
} 