'use server';

import { Analysis, CalculatorType } from '@/types/analysis';

export async function updateAnalysis<T extends CalculatorType>(
  id: string, 
  updatedData: Partial<Analysis<T>>
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