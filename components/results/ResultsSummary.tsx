"use client";

import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import type { AnalysisResults } from '@/types/analysis';
import { isRentalResults, isAirbnbResults, isWholesaleResults, isMortgageResults } from '@/types/analysis';
import { Stat } from './Stat';

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
        cashFlow: results.cashFlow,
        capRate: results.capRate,
        roi: results.roi,
        netOperatingIncome: results.netOperatingIncome,
        totalMonthlyExpenses: results.totalMonthlyExpenses,
        monthlyMortgage: results.monthlyMortgage,
        breakEvenOccupancy: results.breakEvenOccupancy,
        grossRentMultiplier: results.grossRentMultiplier,
        debtServiceCoverageRatio: results.debtServiceCoverageRatio
      });
    }
    if (isAirbnbResults(results)) {
      return Object.entries({
        grossRevenue: results.grossRevenue,
        occupancyRate: results.occupancyRate,
        netProfit: results.netProfit,
        monthlyAirbnbIncome: results.monthlyAirbnbIncome,
        annualCashFlow: results.annualCashFlow,
        totalOperatingExpenses: results.totalOperatingExpenses,
        monthlyMortgage: results.monthlyMortgage,
        breakEvenOccupancy: results.breakEvenOccupancy
      });
    }
    if (isWholesaleResults(results)) {
      return Object.entries({
        assignmentFee: results.assignmentFee,
        estimatedRepairCost: results.estimatedRepairCost,
        profit: results.profit,
        arv: results.arv,
        purchasePrice: results.purchasePrice,
        holdingCosts: results.holdingCosts,
        totalInvestment: results.totalInvestment,
        returnOnInvestment: results.returnOnInvestment
      });
    }
    if (isMortgageResults(results)) {
      return Object.entries({
        monthlyMortgage: results.monthlyMortgage,
        interest: results.interest,
        totalPaid: results.totalPaid,
        loanAmount: results.loanAmount,
        interestRate: results.interestRate,
        loanTerm: results.loanTerm,
        totalMonthlyPayment: results.totalMonthlyPayment
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