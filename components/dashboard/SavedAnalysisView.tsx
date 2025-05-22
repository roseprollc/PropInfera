'use client';

import React, { useState } from 'react';
import type { Analysis, CalculatorType } from '@/types/analysis';
import ExportPDFButton from '@/components/dashboard/ExportPDFButton';
import { ExportCSVButton } from '@/components/dashboard/ExportCSVButton';
import { ShareButton } from '@/components/dashboard/ShareButton';
import { VersionHistoryDialog } from '@/components/dashboard/VersionHistoryDialog';
import { History } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  isRentalResults,
  isAirbnbResults,
  isWholesaleResults
} from '@/types/analysis';

interface SavedAnalysisViewProps<T extends CalculatorType> {
  analysis: Analysis<T>;
  userTier?: 'free' | 'pro' | 'elite';
}

const SavedAnalysisView = <T extends CalculatorType>({ 
  analysis,
  userTier = 'free'
}: SavedAnalysisViewProps<T>) => {
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const renderResultsSummary = () => {
    const { type, data } = analysis;

    switch (type) {
      case 'rental':
        if (!isRentalResults(data)) return null;
        return (
          <div>
            <p>Monthly Cash Flow: ${data.cashFlow.toFixed(2)}</p>
            <p>Cap Rate: {data.capRate.toFixed(2)}%</p>
          </div>
        );
      case 'airbnb':
        if (!isAirbnbResults(data)) return null;
        return (
          <div>
            <p>Monthly Income: ${data.monthlyAirbnbIncome.toFixed(2)}</p>
            <p>Annual Cash Flow: ${data.annualCashFlow.toFixed(2)}</p>
          </div>
        );
      case 'wholesale':
        if (!isWholesaleResults(data)) return null;
        return (
          <div>
            <p>Profit: ${data.profit.toFixed(2)}</p>
            <p>Return on Investment: {data.returnOnInvestment.toFixed(2)}%</p>
          </div>
        );
      default:
        return null;
    }
  };

  const isExportEnabled = userTier !== 'free';
  const analysisId = analysis._id?.toString();

  if (!analysisId) {
    return <div>Error: Invalid analysis ID</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {analysis.source || 'Untitled Analysis'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsVersionHistoryOpen(true)}
            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-700"
            title="View Version History"
          >
            <History className="w-5 h-5 text-white" />
          </button>
          <ShareButton analysisId={analysisId} />
          <ExportCSVButton analysis={analysis} disabled={!isExportEnabled} />
          <ExportPDFButton analysisId={analysisId} />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400">Created: {formatDate(analysis.createdAt)}</p>
        {analysis.updatedAt && (
          <p className="text-gray-400">Last Updated: {formatDate(analysis.updatedAt)}</p>
        )}
      </div>

      {analysis.notes && (
        <p className="text-sm text-gray-600 mb-4">{analysis.notes}</p>
      )}

      <div className="mt-4">
        {renderResultsSummary()}
      </div>

      <VersionHistoryDialog
        analysisId={analysisId}
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />
    </div>
  );
};

export default SavedAnalysisView; 