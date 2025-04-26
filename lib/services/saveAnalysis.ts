import { Analysis, CalculatorInputs, AnalysisResults, CalculatorType } from '@/types/analysis';

export interface SaveAnalysisParams {
  userId: string;
  type: Analysis<CalculatorType>['type'];
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
}

/**
 * Saves an analysis to the database
 */
export async function saveAnalysis(params: SaveAnalysisParams): Promise<SaveAnalysisResponse> {
  if (!params.userId) {
    return { success: false, message: 'User ID is required' };
  }
  
  try {
    const response = await fetch('/api/analyses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.error || 'Failed to save analysis', 
        error: data.error 
      };
    }

    return {
      success: true,
      message: 'Analysis saved successfully',
      analysisId: data.analysisId
    };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return {
      success: false,
      message: 'Failed to save analysis',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 