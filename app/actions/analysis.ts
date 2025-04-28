'use server';

import type { Analysis, AnalysisResultsMap } from '@/types/analysis';

export async function updateAnalysis<T extends keyof AnalysisResultsMap>(
  id: string, 
  updatedData: Partial<{
    [K in keyof Analysis<T>]: Analysis<T>[K]
  }>
) {
  try {
    const response = await fetch(`/api/analyses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to save changes');
    }
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw error;
  }
} 