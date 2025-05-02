import type { CalculatorInputs, Analysis, CalculatorType } from '@/types/analysis';

export interface SavedAnalysis<T extends CalculatorType> {
  id: string;
  inputs: CalculatorInputs[T];
  results: Analysis<T>['data'];
  createdAt: string;
}

const STORAGE_KEY = 'propinfera_saved_analyses';

export function saveAnalysis<T extends CalculatorType>(
  inputs: CalculatorInputs[T],
  results: Analysis<T>['data']
): SavedAnalysis<T> {
  const savedAnalysis: SavedAnalysis<T> = {
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

export function getSavedAnalyses<T extends CalculatorType>(): SavedAnalysis<T>[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteSavedAnalysis(id: string): void {
  const analyses = getSavedAnalyses();
  const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
}

export function formatAnalysisForDisplay<T extends CalculatorType>(analysis: Analysis<T>): Record<string, unknown> {
  return {
    ...analysis,
    createdAt: new Date(analysis.createdAt).toLocaleDateString(),
    updatedAt: new Date(analysis.updatedAt).toLocaleDateString(),
  };
}

export function validateAnalysisData<T extends CalculatorType>(data: unknown): data is Analysis<T> {
  if (!data || typeof data !== 'object') return false;
  
  const analysis = data as Partial<Analysis<T>>;
  return (
    typeof analysis?._id === 'string' &&
    typeof analysis?.type === 'string' &&
    typeof analysis?.createdAt === 'string' &&
    typeof analysis?.updatedAt === 'string' &&
    typeof analysis?.data === 'object'
  );
} 