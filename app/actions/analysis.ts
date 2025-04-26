'use server';

import { Analysis } from '@/types/analysis';

export async function updateAnalysis(id: string, updatedData: Partial<Analysis>) {
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