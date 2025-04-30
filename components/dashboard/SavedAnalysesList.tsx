"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import type { Analysis, CalculatorType } from '@/types/analysis';

interface SavedAnalysesListProps<T extends CalculatorType> {
  analyses: Analysis<T>[];
  onSelect: (analysis: Analysis<T>) => void;
}

export default function SavedAnalysesList<T extends CalculatorType>({ 
  analyses, 
  onSelect 
}: SavedAnalysesListProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Defensive check for invalid data
  if (!Array.isArray(analyses)) {
    console.error('Invalid analyses data:', analyses);
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-400">Error: Invalid data received. Please try refreshing the page.</p>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Saved Analyses</h3>
        <p className="text-gray-400">Create your first analysis to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {analyses.map((analysis) => {
        const id = analysis._id?.toString() || '';
        return (
          <div
            key={id}
            className={`p-4 rounded-lg cursor-pointer ${
              selectedId === id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => {
              setSelectedId(id);
              onSelect(analysis);
            }}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{analysis.title || 'Untitled Analysis'}</h3>
              <span className="text-sm">
                {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            {analysis.notes && (
              <p className="mt-1 text-sm text-gray-400 line-clamp-2">{analysis.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
} 