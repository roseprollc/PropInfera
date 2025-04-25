"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAnalysis } from '@/context/AnalysisContext';
import { CalculatorInputs, RentalAnalysisResults, AnalysisType } from '@/types/analysis';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import Toast from '@/components/ui/Toast';
import ActionButtons from "@/components/ui/ActionButtons";
import ResultsSummary from '@/components/results/ResultsSummary';
import { saveAnalysis } from '@/lib/services/saveAnalysis';

export default function RentersCalculator() {
  const { state, updateCalculatorInputs, runAnalysis, resetCalculator } = useAnalysis();
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');

  // Memoize the reset and update functions with stable dependencies
  const handleReset = useCallback(() => {
    console.log('Resetting calculator...');
    resetCalculator();
  }, [resetCalculator]);

  const handleUpdateInputs = useCallback((data: Partial<CalculatorInputs>) => {
    console.log('Updating calculator inputs:', data);
    updateCalculatorInputs(data);
  }, [updateCalculatorInputs]);

  // Effect to handle initial setup and imported data
  useEffect(() => {
    console.log('Effect running...');
    console.log('Current calculator inputs:', state.calculatorInputs);

    // Check for imported property data
    const importedData = sessionStorage.getItem("importedProperty");
    if (importedData) {
      try {
        console.log('Found imported data in sessionStorage');
        const parsedData = JSON.parse(importedData);
        console.log('Parsed imported data:', parsedData);
        handleUpdateInputs(parsedData);
        // Clear the imported data after using it
        sessionStorage.removeItem("importedProperty");
        console.log('Cleared imported data from sessionStorage');
      } catch (error) {
        console.error("Failed to parse imported property data:", error);
      }
    } else {
      console.log('No imported data found in sessionStorage');
    }
  }, [handleUpdateInputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    console.log(`Updating ${field} to:`, value);
    handleUpdateInputs({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with inputs:', state.calculatorInputs);
    runAnalysis();
    setActiveTab('results');
  };

  const handleSaveAnalysis = async () => {
    if (!state.currentProperty?.analysis) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveAnalysis({
        userId: 'mock-user-123',
        type: 'renters' as AnalysisType,
        inputs: state.calculatorInputs,
        results: state.currentProperty.analysis,
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

  const renderInputField = (
    label: string,
    field: keyof CalculatorInputs,
    type: 'text' | 'number' = 'number',
    step: string = '0.01'
  ) => {
    const value = state.calculatorInputs[field];
    console.log(`Rendering input field ${field} with value:`, value);

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          step={step}
          className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  };

  const renderResultsPanel = () => {
    if (!state.currentProperty?.analysis) {
      return (
        <div className="p-6 text-center text-gray-400">
          Run the analysis to see results
        </div>
      );
    }

    const analysis = state.currentProperty.analysis as RentalAnalysisResults;
    const results: Record<string, number> = {
      monthlyCashFlow: analysis.monthlyCashFlow,
      annualCashFlow: analysis.annualCashFlow,
      capRate: analysis.capRate,
      cashOnCash: analysis.cashOnCash,
      roi: analysis.roi,
      totalCashInvestment: analysis.totalCashInvestment,
      netOperatingIncome: analysis.netOperatingIncome,
      totalOperatingExpenses: analysis.totalOperatingExpenses,
      monthlyMortgagePayment: analysis.monthlyMortgagePayment,
      breakEvenOccupancy: analysis.breakEvenOccupancy,
      irr: analysis.irr,
      grossRentMultiplier: analysis.grossRentMultiplier,
      debtServiceCoverageRatio: analysis.debtServiceCoverageRatio
    };

    return (
      <div className="p-6">
        <ResultsSummary
          title="Rental Property Metrics"
          results={results}
          highlightKeys={['monthlyCashFlow', 'cashOnCash', 'capRate']}
        />
      </div>
    );
  };

  const formatValue = (key: string, value: number): string => {
    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')) {
      return formatPercentage(value);
    }
    return formatCurrency(value);
  };

  return (
    <div className="bg-[#111] rounded-lg shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'inputs'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'results'
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
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
                <h3 className="text-lg font-medium text-gray-300 mb-4">Property Details</h3>
                {renderInputField('Property Address', 'propertyAddress', 'text')}
                {renderInputField('Purchase Price', 'purchasePrice')}
                {renderInputField('Down Payment (%)', 'downPaymentPercent')}
                {renderInputField('Interest Rate (%)', 'interestRate')}
                {renderInputField('Loan Term (years)', 'loanTerm')}
                {renderInputField('Closing Costs', 'closingCosts')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Income & Expenses</h3>
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
          <>
            {renderResultsPanel()}

            {/* Notes and Title Inputs */}
            {state.currentProperty?.analysis && (
              <div className="p-6 border-t border-gray-700">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Analysis Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={state.calculatorInputs.propertyAddress || 'Untitled Analysis'}
                    className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this analysis..."
                    className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      <ActionButtons
        onReset={handleReset}
        onSave={handleSaveAnalysis}
        saveDisabled={!state.currentProperty?.analysis || isSaving}
      />
    </div>
  );
} 