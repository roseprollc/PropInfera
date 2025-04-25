import { CalculatorInputs } from '@/types/analysis';

export interface SavedAnalysis {
  id: string;
  inputs: CalculatorInputs;
  results: any; // Using any since we don't have the exact type
  createdAt: string;
}

const STORAGE_KEY = 'propinfera_saved_analyses';

export function saveAnalysis(inputs: CalculatorInputs, results: any): SavedAnalysis {
  const savedAnalysis: SavedAnalysis = {
    id: Date.now().toString(),
    inputs,
    results,
    createdAt: new Date().toISOString()
  };

  const existingAnalyses = getSavedAnalyses();
  const updatedAnalyses = [...existingAnalyses, savedAnalysis];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));

  return savedAnalysis;
}

export function getSavedAnalyses(): SavedAnalysis[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteSavedAnalysis(id: string): void {
  const analyses = getSavedAnalyses();
  const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
} 