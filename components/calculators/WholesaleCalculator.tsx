"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import { CalculatorInputs, WholesaleAnalysisResults } from '@/types/analysis';
import ActionButtons from "@/components/ui/ActionButtons";
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { saveAnalysis } from '@/lib/services/saveAnalysis';

interface WholesaleInputs extends CalculatorInputs {
  afterRepairValue: number;
  repairCosts: number;
  assignmentFee: number;
  miscHoldingCosts: number;
}

const defaultInputs: WholesaleInputs = {
  propertyAddress: '',
  purchasePrice: 200000,
  downPaymentPercent: 0,
  interestRate: 0,
  loanTerm: 0,
  closingCosts: 5000,
  propertyTaxAnnual: 0,
  insuranceAnnual: 0,
  utilitiesMonthly: 0,
  maintenancePercent: 0,
  propertyManagementPercent: 0,
  monthlyRent: 0,
  vacancyRatePercent: 0,
  capExReservePercent: 0,
  annualAppreciationPercent: 0,
  annualRentIncreasePercent: 0,
  holdingPeriodYears: 0,
  nightlyRate: 0,
  occupancyRate: 0,
  cleaningFee: 0,
  platformFeesPercent: 0,
  afterRepairValue: 300000,
  repairCosts: 30000,
  assignmentFee: 10000,
  miscHoldingCosts: 0,
  hoaFees: 0
};

export function WholesaleCalculator() {
  const { state, dispatch } = useCalculator();
  const [results, setResults] = useState<WholesaleAnalysisResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof CalculatorInputs, value: number | string) => {
    dispatch({ type: 'SET_INPUT', field, value });
  };

  const calculateResults = () => {
    const {
      purchasePrice,
      closingCosts,
      afterRepairValue,
      repairCosts,
      assignmentFee,
      miscHoldingCosts,
    } = state.calculatorInputs as WholesaleInputs;

    const totalInvestment = purchasePrice + repairCosts + assignmentFee + closingCosts + miscHoldingCosts;
    const profit = afterRepairValue - totalInvestment;
    const roi = (profit / totalInvestment) * 100;

    const wholesaleResults: WholesaleAnalysisResults = {
      totalInvestment,
      profit,
      roi,
      holdingCosts: miscHoldingCosts,
      netProfit: profit,
      returnOnInvestment: roi,
      assignmentFee
    };

    setResults(wholesaleResults);
    dispatch({ type: 'SET_RESULTS', results: { type: 'wholesale', data: wholesaleResults } });
  };

  const handleSave = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: 'mock-user-123',
        type: 'wholesale',
        inputs: state.calculatorInputs,
        results: { type: 'wholesale', data: results },
        title: state.calculatorInputs.propertyAddress || 'Untitled Analysis',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateResults();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Property Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Property Address
              </label>
              <input
                type="text"
                value={state.calculatorInputs.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                After Repair Value
              </label>
              <input
                type="number"
                value={(state.calculatorInputs as WholesaleInputs).afterRepairValue}
                onChange={(e) => handleInputChange('afterRepairValue', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                value={state.calculatorInputs.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Repair Costs
              </label>
              <input
                type="number"
                value={(state.calculatorInputs as WholesaleInputs).repairCosts}
                onChange={(e) => handleInputChange('repairCosts', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Deal Costs</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assignment Fee
              </label>
              <input
                type="number"
                value={(state.calculatorInputs as WholesaleInputs).assignmentFee}
                onChange={(e) => handleInputChange('assignmentFee', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Closing Costs
              </label>
              <input
                type="number"
                value={state.calculatorInputs.closingCosts}
                onChange={(e) => handleInputChange('closingCosts', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Misc Holding Costs
              </label>
              <input
                type="number"
                value={(state.calculatorInputs as WholesaleInputs).miscHoldingCosts}
                onChange={(e) => handleInputChange('miscHoldingCosts', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-[#2ecc71]/50"
          >
            Calculate
          </button>
        </div>

        <ActionButtons
          onReset={() => dispatch({ type: 'RESET_CALCULATOR' })}
          onSave={handleSave}
          saveDisabled={!results || isSaving}
        />
      </form>

      {results && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Investment Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Investment</span>
              <span className="text-white font-medium">{formatCurrency(results.totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Profit</span>
              <span className="text-white font-medium">{formatCurrency(results.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">ROI</span>
              <span className="text-[#2ecc71] font-bold">{formatPercentage(results.roi)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

WholesaleCalculator.displayName = "WholesaleCalculator"; 