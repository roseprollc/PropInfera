"use client";

import { useState } from 'react';
import { useAnalysis } from '@/context/AnalysisContext';
import { CalculatorInputs } from '@/types/analysis';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';

export default function RentersCalculator() {
  const { state, updateCalculatorInputs, runAnalysis } = useAnalysis();
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    updateCalculatorInputs({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis();
    setActiveTab('results');
  };

  const renderInputField = (
    label: string,
    field: keyof CalculatorInputs,
    type: 'text' | 'number' = 'number',
    step: string = '0.01'
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={state.calculatorInputs[field]}
        onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const renderResultsPanel = () => {
    if (!state.currentProperty?.analysis) {
      return (
        <div className="p-6 text-center text-gray-500">
          Run the analysis to see results
        </div>
      );
    }

    const { analysis } = state.currentProperty;

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Monthly Cash Flow</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(analysis.monthlyCashFlow)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Cap Rate</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {formatPercent(analysis.capRate)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Cash on Cash Return</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {formatPercent(analysis.cashOnCash)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'inputs'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'results'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Results
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'inputs' ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                {renderInputField('Property Address', 'propertyAddress', 'text')}
                {renderInputField('Purchase Price', 'purchasePrice')}
                {renderInputField('Down Payment (%)', 'downPaymentPercent')}
                {renderInputField('Interest Rate (%)', 'interestRate')}
                {renderInputField('Loan Term (years)', 'loanTerm')}
                {renderInputField('Closing Costs', 'closingCosts')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Income & Expenses</h3>
                {renderInputField('Monthly Rent', 'monthlyRent')}
                {renderInputField('Vacancy Rate (%)', 'vacancyRatePercent')}
                {renderInputField('Property Management (%)', 'propertyManagementPercent')}
                {renderInputField('Maintenance (%)', 'maintenancePercent')}
                {renderInputField('Property Tax (annual)', 'propertyTaxAnnual')}
                {renderInputField('Insurance (annual)', 'insuranceAnnual')}
                {renderInputField('Utilities (monthly)', 'utilitiesMonthly')}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Run Analysis
              </button>
            </div>
          </form>
        ) : (
          renderResultsPanel()
        )}
      </div>
    </div>
  );
} 