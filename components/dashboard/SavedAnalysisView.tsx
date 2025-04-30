'use client';

import React from 'react';
import type { Analysis, CalculatorType } from '@/types/analysis';
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton';
import { formatDate } from '@/lib/utils';
import {
  isMortgageResults,
  isRentalResults,
  isAirbnbResults,
  isWholesaleResults,
  isRentersResults
} from '@/types/analysis';

interface SavedAnalysisViewProps<T extends CalculatorType> {
  analysis: Analysis<T>;
}

const SavedAnalysisView = <T extends CalculatorType>({ analysis }: SavedAnalysisViewProps<T>) => {
  const renderResultsSummary = () => {
    const { type, data } = analysis;

    switch (type) {
      case 'mortgage':
        if (!isMortgageResults(data)) return null;
        return (
          <div>
            <p>Monthly Payment: ${data.monthlyPayment.toFixed(2)}</p>
            <p>Principal & Interest: ${data.principalAndInterest.toFixed(2)}</p>
          </div>
        );
      case 'rental':
        if (!isRentalResults(data)) return null;
        return (
          <div>
            <p>Monthly Cash Flow: ${data.monthlyCashFlow.toFixed(2)}</p>
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
            <p>Assignment Fee: ${data.assignmentFee.toFixed(2)}</p>
            <p>Profit: ${data.profit.toFixed(2)}</p>
          </div>
        );
      case 'renters':
        if (!isRentersResults(data)) return null;
        return (
          <div>
            <p>Monthly Cash Flow: ${data.monthlyCashFlow.toFixed(2)}</p>
            <p>Annual Cash Flow: ${data.annualCashFlow.toFixed(2)}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{analysis.title || 'Untitled Analysis'}</h1>
        <ExportPDFButton analysis={analysis} />
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400">Created: {formatDate(analysis.createdAt)}</p>
        <p className="text-gray-400">Last Updated: {formatDate(analysis.updatedAt)}</p>
      </div>

      {analysis.notes && (
        <p className="text-sm text-gray-600 mb-4">{analysis.notes}</p>
      )}

      <div className="mt-4">
        {renderResultsSummary()}
      </div>
    </div>
  );
};

export default SavedAnalysisView; 