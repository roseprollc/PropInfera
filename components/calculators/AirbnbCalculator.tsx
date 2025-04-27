"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import ActionButtons from '@/components/ui/ActionButtons';
import { calculateAirbnbMetrics } from '@/lib/calculators/airbnb';
import { saveAnalysis } from '@/lib/services/saveAnalysis';
import { AirbnbInputs } from '@/types/analysis';
import { Button } from '@/components/ui/button';

export function AirbnbCalculator() {
  const { state, dispatch } = useCalculator<'airbnb'>();
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof AirbnbInputs, value: number | string) => {
    dispatch({ type: 'SET_INPUTS', payload: { [field]: value } });
  };

  const calculateResults = () => {
    const metrics = calculateAirbnbMetrics(state.inputs as unknown as AirbnbInputs);
    dispatch({ 
      type: 'SET_RESULTS', 
      payload: {
        type: 'airbnb',
        ...metrics
      }
    });
  };

  const handleSave = async () => {
    if (!state.results) return;

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: 'mock-user-123',
        type: 'airbnb',
        inputs: state.inputs as unknown as AirbnbInputs,
        results: state.results,
        title: state.inputs.propertyAddress || 'Untitled Analysis',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'SET_INPUTS', payload: {} });
    dispatch({ type: 'SET_RESULTS', payload: null });
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
              value={state.inputs.propertyAddress}
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
              value={state.inputs.purchasePrice}
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
              value={state.inputs.downPaymentPercent}
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
              value={state.inputs.interestRate}
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
              value={state.inputs.loanTerm}
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
              value={state.inputs.nightlyRate}
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
              value={state.inputs.occupancyRate}
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
              value={state.inputs.cleaningFee}
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
              value={state.inputs.platformFeesPercent}
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
        onReset={handleReset}
        onSave={handleSave}
        saveDisabled={!state.results || isSaving}
      />
    </div>
  );
}

AirbnbCalculator.displayName = "AirbnbCalculator"; 