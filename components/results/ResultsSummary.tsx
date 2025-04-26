"use client";

import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { AnalysisResults, isRentalResults, isAirbnbResults, isWholesaleResults, isMortgageResults, isRentersResults } from '@/types/analysis';

interface ResultsSummaryProps {
  results: AnalysisResults;
  title?: string;
  highlightKeys?: string[];
}

export default function ResultsSummary({ results, title, highlightKeys = [] }: ResultsSummaryProps) {
  const formatValue = (key: string, value: number): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }

    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')) {
      return formatPercentage(value);
    }
    return formatCurrency(value);
  };

  const isHighlighted = (key: string) => highlightKeys.includes(key);

  const getResultsEntries = (): [string, number][] => {
    if (isRentalResults(results)) {
      return Object.entries({
        monthlyCashFlow: results.monthlyCashFlow,
        annualCashFlow: results.annualCashFlow,
        capRate: results.capRate,
        cashOnCash: results.cashOnCash,
        roi: results.roi,
        totalCashInvestment: results.totalCashInvestment,
        netOperatingIncome: results.netOperatingIncome,
        totalOperatingExpenses: results.totalOperatingExpenses,
        monthlyMortgagePayment: results.monthlyMortgagePayment,
        breakEvenOccupancy: results.breakEvenOccupancy,
        irr: results.irr,
        grossRentMultiplier: results.grossRentMultiplier,
        debtServiceCoverageRatio: results.debtServiceCoverageRatio
      });
    }
    if (isAirbnbResults(results)) {
      return Object.entries({
        monthlyAirbnbIncome: results.monthlyAirbnbIncome,
        annualCashFlow: results.annualCashFlow,
        roi: results.roi,
        netOperatingIncome: results.netOperatingIncome,
        totalOperatingExpenses: results.totalOperatingExpenses,
        monthlyMortgagePayment: results.monthlyMortgagePayment,
        totalCashInvestment: results.totalCashInvestment,
        breakEvenOccupancy: results.breakEvenOccupancy,
        averageDailyRate: results.averageDailyRate,
        projectedAnnualIncome: results.projectedAnnualIncome
      });
    }
    if (isWholesaleResults(results)) {
      return Object.entries({
        assignmentFee: results.assignmentFee,
        roi: results.roi,
        profit: results.profit,
        totalInvestment: results.totalInvestment,
        holdingCosts: results.holdingCosts,
        netProfit: results.netProfit,
        returnOnInvestment: results.returnOnInvestment
      });
    }
    if (isMortgageResults(results)) {
      return Object.entries({
        monthlyPayment: results.monthlyPayment,
        principalAndInterest: results.principalAndInterest,
        totalMonthlyPayment: results.totalMonthlyPayment
      });
    }
    if (isRentersResults(results)) {
      return Object.entries({
        monthlyCashFlow: results.monthlyCashFlow,
        annualCashFlow: results.annualCashFlow,
        monthlyRevenue: results.monthlyRevenue
      });
    }
    return [];
  };

  const entries = getResultsEntries();

  if (entries.length === 0) {
    return (
      <div className="bg-[#111] rounded-lg shadow-lg p-6">
        <p className="text-gray-400 text-center">No results available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] rounded-lg shadow-lg p-6">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-6">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-sm text-gray-400 mb-1">
              {key.split(/(?=[A-Z])/).join(' ')}
            </div>
            <div
              className={`text-xl ${
                isHighlighted(key)
                  ? 'text-[#2ecc71] font-semibold [text-shadow:_0_0_8px_rgba(46,204,113,0.5)]'
                  : 'text-white'
              }`}
            >
              {formatValue(key, value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
ResultsSummary.displayName = "ResultsSummary"; 