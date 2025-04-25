import { AnalysisType, CalculatorInputs, AnalysisResults } from '@/types/analysis';

interface SaveAnalysisParams {
  userId: string;
  type: AnalysisType;
  inputs: CalculatorInputs;
  results: AnalysisResults;
  title?: string;
  notes?: string;
}

interface SaveAnalysisResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function saveAnalysis({
  userId,
  type,
  inputs,
  results,
  title,
  notes,
}: SaveAnalysisParams): Promise<SaveAnalysisResponse> {
  try {
    const response = await fetch('/api/analyses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        inputs,
        results,
        title,
        notes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save analysis');
    }

    return {
      success: true,
      message: 'Analysis saved successfully',
    };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return {
      success: false,
      message: 'Failed to save analysis',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 