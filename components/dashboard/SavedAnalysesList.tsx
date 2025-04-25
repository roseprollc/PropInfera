"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { formatCurrency, formatPercentage, capitalizeWords } from '@/lib/utils/formatting';
import { Analysis } from '@/types/analysis';

interface SavedAnalysesListProps {
  analyses: Analysis[];
}

export default function SavedAnalysesList({ analyses }: SavedAnalysesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Defensive check for invalid data
  if (!Array.isArray(analyses)) {
    console.error('Invalid analyses data:', analyses);
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-400">Error: Invalid data received. Please try refreshing the page.</p>
      </div>
    );
  }

  // Filter analyses based on search query and selected type
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = 
      analysis.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || analysis.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Format result values based on their keys
  const formatResultValue = (key: string, value: number): string => {
    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')) {
      return formatPercentage(value);
    }
    return formatCurrency(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-400">{error}</p>
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

  if (filteredAnalyses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Matching Analyses</h3>
        <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search analyses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#222] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 bg-[#222] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="all">All Types</option>
          <option value="renters">Renters</option>
          <option value="airbnb">Airbnb</option>
          <option value="wholesale">Wholesale</option>
          <option value="mortgage">Mortgage</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredAnalyses.map((analysis) => (
          <div
            key={analysis._id.toString()}
            className="p-4 bg-[#222] rounded-lg hover:bg-[#333] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {analysis.propertyName || 'Untitled Analysis'}
                </h3>
                <p className="text-sm text-gray-400">
                  {analysis.address || 'No address provided'}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                  {capitalizeWords(analysis.type)}
                </span>
                <p className="text-sm text-gray-400 mt-1">
                  {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(analysis.results).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm text-gray-400">
                    {capitalizeWords(key.replace(/([A-Z])/g, ' $1').trim())}
                  </p>
                  <p className="text-white font-medium">
                    {formatResultValue(key, value as number)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 