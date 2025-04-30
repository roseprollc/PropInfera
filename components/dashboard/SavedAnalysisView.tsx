'use client';

import { format } from 'date-fns';
import type { Analysis, CalculatorType, AnalysisResultsMap } from '@/types/analysis';
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton';
import ResultsSummary from '@/components/results/ResultsSummary';

interface SavedAnalysisViewProps<T extends CalculatorType> {
  analysis: Analysis<T>;
}

export function SavedAnalysisView<T extends CalculatorType>({ analysis }: SavedAnalysisViewProps<T>) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{analysis.title || 'Untitled Analysis'}</h1>
        <ExportPDFButton analysis={analysis} />
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400">Created: {format(new Date(analysis.createdAt), 'PPP')}</p>
        <p className="text-gray-400">Last Updated: {format(new Date(analysis.updatedAt), 'PPP')}</p>
      </div>

      <ResultsSummary 
        results={analysis.data}
        highlightKeys={['monthlyCashFlow', 'cashOnCash', 'roi']}
      />
    </div>
  );
} 