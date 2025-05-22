"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import type { Analysis, CalculatorType } from '@/types/analysis';

// Dynamically import SavedAnalysisView
const SavedAnalysisView = dynamic(
  () => import('@/components/dashboard/SavedAnalysisView'),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 bg-gray-800 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    )
  }
);

interface SavedAnalysesListProps<T extends CalculatorType> {
  analyses?: Analysis<T>[];
  onSelect?: (analysis: Analysis<T>) => void;
  userId?: string;
}

class SavedAnalysesErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('SavedAnalysesList error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-400">Error loading analyses. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function SavedAnalysesList<T extends CalculatorType>({ 
  analyses = [], 
  onSelect = () => {},
  userId
}: SavedAnalysesListProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userAnalyses, setUserAnalyses] = useState<Analysis<T>[]>([]);

  useEffect(() => {
    if (userId) {
      // Fetch analyses for the user
      fetch(`/api/analyses?userId=${userId}`)
        .then(res => res.json())
        .then(data => setUserAnalyses(data))
        .catch(error => console.error('Error fetching analyses:', error));
    }
  }, [userId]);

  const displayAnalyses = analyses.length > 0 ? analyses : userAnalyses;

  // Defensive check for invalid data
  if (!Array.isArray(displayAnalyses)) {
    console.error('Invalid analyses data:', displayAnalyses);
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-400">Error: Invalid data received. Please try refreshing the page.</p>
      </div>
    );
  }

  if (displayAnalyses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Saved Analyses</h3>
        <p className="text-gray-400">Create your first analysis to see it here.</p>
      </div>
    );
  }

  return (
    <SavedAnalysesErrorBoundary>
      <div className="space-y-4">
        {displayAnalyses.map((analysis) => {
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
                <h3 className="font-medium">{analysis.source || 'Untitled Analysis'}</h3>
                <span className="text-sm">
                  {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {analysis.notes && (
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{analysis.notes}</p>
              )}
              {selectedId === id && (
                <Suspense fallback={
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                  </div>
                }>
                  <div className="mt-4">
                    <SavedAnalysisView analysis={analysis} />
                  </div>
                </Suspense>
              )}
            </div>
          );
        })}
      </div>
    </SavedAnalysesErrorBoundary>
  );
} 