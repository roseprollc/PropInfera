"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import { CalculatorInput } from '@/types/calculator';
import { calculateAirbnbMetrics } from '@/lib/calculators/airbnb';
import Toast from '@/components/ui/Toast';
import ActionButtons from "@/components/ui/ActionButtons";
import { Button } from '@/components/ui/button';
import { saveAnalysis } from '@/lib/services/saveAnalysis';

interface AirbnbInputs extends CalculatorInput {
  nightlyRate: number;
  occupancyRate: number;
  cleaningFee: number;
  platformFeesPercent: number;
}

interface AirbnbResults {
  monthlyMortgagePayment: number;
  monthlyOperatingExpenses: number;
  monthlyRevenue: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
}

const defaultInputs: AirbnbInputs = {
  propertyAddress: '',
  purchasePrice: 300000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  closingCosts: 9000,
  propertyTaxAnnual: 3600,
  insuranceAnnual: 1200,
  utilitiesMonthly: 200,
  maintenancePercent: 5,
  propertyManagementPercent: 8,
  monthlyRent: 0,
  vacancyRatePercent: 0,
  capExReservePercent: 0,
  annualAppreciationPercent: 3,
  annualRentIncreasePercent: 2,
  holdingPeriodYears: 5,
  nightlyRate: 150,
  occupancyRate: 70,
  cleaningFee: 100,
  platformFeesPercent: 3
};

export function AirbnbCalculator() {
  const { state, dispatch } = useCalculator();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');

  const handleInputChange = (field: keyof AirbnbInputs, value: number | string) => {
    dispatch({ type: 'SET_INPUT', field, value });
  };

  const calculateResults = () => {
    const results = calculateAirbnbMetrics(state.calculatorInputs as AirbnbInputs);
    dispatch({ type: 'SET_RESULTS', results });
  };

  const handleSaveAnalysis = async () => {
    if (!state.results) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveAnalysis({
        userId: 'mock-user-123',
        type: 'airbnb',
        inputs: state.calculatorInputs,
        results: state.results,
        title: title || state.calculatorInputs.propertyAddress || 'Untitled Analysis',
        notes,
      });

      setToastMessage(result.message);
      setShowToast(true);
    } catch (error) {
      console.error('Error saving analysis:', error);
      setToastMessage('Failed to save analysis');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#111] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-4">Airbnb Calculator</h2>
      </div>

      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Property Address
            </label>
            <input
              type="text"
              value={state.calculatorInputs.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Down Payment (%)
            </label>
            <input
              type="number"
              value={state.calculatorInputs.downPaymentPercent}
              onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={state.calculatorInputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Loan Term (years)
            </label>
            <input
              type="number"
              value={state.calculatorInputs.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Income & Expenses</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nightly Rate
            </label>
            <input
              type="number"
              value={state.calculatorInputs.nightlyRate}
              onChange={(e) => handleInputChange('nightlyRate', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Occupancy Rate (%)
            </label>
            <input
              type="number"
              value={state.calculatorInputs.occupancyRate}
              onChange={(e) => handleInputChange('occupancyRate', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cleaning Fee
            </label>
            <input
              type="number"
              value={state.calculatorInputs.cleaningFee}
              onChange={(e) => handleInputChange('cleaningFee', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Platform Fees (%)
            </label>
            <input
              type="number"
              value={state.calculatorInputs.platformFeesPercent}
              onChange={(e) => handleInputChange('platformFeesPercent', Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-700">
        <div className="flex justify-center">
          <Button
            onClick={calculateResults}
            className="px-6 py-3 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-[#2ecc71]/50"
          >
            Calculate
          </Button>
        </div>
      </div>

      <ActionButtons
        onReset={() => dispatch({ type: 'RESET_CALCULATOR' })}
        onSave={handleSaveAnalysis}
        saveDisabled={!state.results || isSaving}
      />
    </div>
  );
}

AirbnbCalculator.displayName = "AirbnbCalculator"; 