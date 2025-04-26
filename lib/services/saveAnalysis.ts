import { 
  Analysis, 
  AnalysisType, 
  CalculatorInputs, 
  AnalysisResults,
  MortgageInputs,
  AirbnbInputs,
  WholesaleInputs,
  RentersInputs,
  MortgageResults,
  AirbnbResults,
  WholesaleResults,
  RentersResults
} from '@/types/analysis';

// API URL from environment variables with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Timeout for fetch requests in milliseconds
const FETCH_TIMEOUT = 10000;

// Maximum number of retry attempts
const MAX_RETRIES = 3;

export interface SaveAnalysisParams {
  userId: string;
  type: AnalysisType;
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

// Type guard functions to validate inputs and results match the specified type
function isMortgageInputs(inputs: CalculatorInputs, type: AnalysisType): inputs is MortgageInputs {
  return type === 'mortgage';
}

function isAirbnbInputs(inputs: CalculatorInputs, type: AnalysisType): inputs is AirbnbInputs {
  return type === 'airbnb';
}

function isWholesaleInputs(inputs: CalculatorInputs, type: AnalysisType): inputs is WholesaleInputs {
  return type === 'wholesale';
}

function isRentersInputs(inputs: CalculatorInputs, type: AnalysisType): inputs is RentersInputs {
  return type === 'renters';
}

function isMortgageResults(results: AnalysisResults, type: AnalysisType): results is MortgageResults {
  return type === 'mortgage';
}

function isAirbnbResults(results: AnalysisResults, type: AnalysisType): results is AirbnbResults {
  return type === 'airbnb';
}

function isWholesaleResults(results: AnalysisResults, type: AnalysisType): results is WholesaleResults {
  return type === 'wholesale';
}

function isRentersResults(results: AnalysisResults, type: AnalysisType): results is RentersResults {
  return type === 'renters';
}

// Validate that inputs and results match the specified type
function validateInputsAndResults(params: SaveAnalysisParams): string | null {
  const { type, inputs, results } = params;
  
  // Validate inputs based on type
  if (type === 'mortgage' && !isMortgageInputs(inputs, type)) {
    return 'Invalid inputs for mortgage analysis';
  } else if (type === 'airbnb' && !isAirbnbInputs(inputs, type)) {
    return 'Invalid inputs for Airbnb analysis';
  } else if (type === 'wholesale' && !isWholesaleInputs(inputs, type)) {
    return 'Invalid inputs for wholesale analysis';
  } else if (type === 'renters' && !isRentersInputs(inputs, type)) {
    return 'Invalid inputs for renters analysis';
  }
  
  // Validate results based on type
  if (type === 'mortgage' && !isMortgageResults(results, type)) {
    return 'Invalid results for mortgage analysis';
  } else if (type === 'airbnb' && !isAirbnbResults(results, type)) {
    return 'Invalid results for Airbnb analysis';
  } else if (type === 'wholesale' && !isWholesaleResults(results, type)) {
    return 'Invalid results for wholesale analysis';
  } else if (type === 'renters' && !isRentersResults(results, type)) {
    return 'Invalid results for renters analysis';
  }
  
  return null;
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
  
  // Validate type-specific inputs and results
  const validationError = validateInputsAndResults(params);
  if (validationError) {
    return {
      success: false,
      message: validationError,
      errorCode: 'VALIDATION_ERROR'
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