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

      <div className="p-6">
        {activeTab === 'inputs' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Address
                </label>
                <input
                  type="text"
                  value={state.calculatorInputs.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Price
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Financing Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.downPaymentPercent}
                  onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loan Term (years)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rental Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vacancy Rate (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.vacancyRatePercent}
                  onChange={(e) => handleInputChange('vacancyRatePercent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Management (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.propertyManagementPercent}
                  onChange={(e) => handleInputChange('propertyManagementPercent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maintenance (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.maintenancePercent}
                  onChange={(e) => handleInputChange('maintenancePercent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CapEx Reserve (%)
                </label>
                <input
                  type="number"
                  value={state.calculatorInputs.capExReservePercent}
                  onChange={(e) => handleInputChange('capExReservePercent', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Calculate
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {state.currentProperty && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Monthly Cash Flow</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(state.currentProperty.analysis.monthlyCashFlow)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Cap Rate</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPercent(state.currentProperty.analysis.capRate)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Cash on Cash</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPercent(state.currentProperty.analysis.cashOnCash)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">ROI</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPercent(state.currentProperty.analysis.roi)}
                    </p>
                  </div>
                </div>

                {/* 5-Year Projection */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">5-Year Projection</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Rent
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Expenses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Cash Flow
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {state.currentProperty.analysis.fiveYearProjection.map((year) => (
                          <tr key={year.year}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {year.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(year.propertyValue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(year.annualRent)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(year.annualExpenses)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(year.annualCashFlow)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 