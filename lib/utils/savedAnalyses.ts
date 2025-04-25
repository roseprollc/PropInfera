import { CalculatorInputs, Analysis } from '@/types/analysis';

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

export function formatAnalysisForDisplay(analysis: Analysis): Record<string, unknown> {
  return {
    ...analysis,
    createdAt: new Date(analysis.createdAt).toLocaleDateString(),
    updatedAt: new Date(analysis.updatedAt).toLocaleDateString(),
  };
}

export function validateAnalysisData(data: unknown): data is Analysis {
  if (!data || typeof data !== 'object') return false;
  
  const analysis = data as Partial<Analysis>;
  return (
    typeof analysis._id === 'string' &&
    typeof analysis.type === 'string' &&
    typeof analysis.createdAt === 'string' &&
    typeof analysis.updatedAt === 'string' &&
    typeof analysis.inputs === 'object' &&
    typeof analysis.results === 'object'
  );
} 