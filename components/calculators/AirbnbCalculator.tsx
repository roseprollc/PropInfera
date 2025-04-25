"use client";

import { useState } from "react";
import { AnalysisType } from '@/types/analysis';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import Toast from '@/components/ui/Toast';
import ActionButtons from "@/components/ui/ActionButtons";
import ResultsSummary from '@/components/results/ResultsSummary';
import { saveAnalysis } from '@/lib/services/saveAnalysis';

interface AirbnbInputs {
  propertyAddress: string;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  utilitiesMonthly: number;
  maintenancePercent: number;
  propertyManagementPercent: number;
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
  propertyAddress: "",
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
  nightlyRate: 150,
  occupancyRate: 70,
  cleaningFee: 100,
  platformFeesPercent: 3,
};

export default function AirbnbCalculator() {
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [inputs, setInputs] = useState<AirbnbInputs>(defaultInputs);
  const [results, setResults] = useState<AirbnbResults | null>(null);

  const handleInputChange = (field: keyof AirbnbInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: field === "propertyAddress" ? value : Number(value),
    }));
  };

  const calculateResults = () => {
    const {
      purchasePrice,
      downPaymentPercent,
      interestRate,
      loanTerm,
      propertyTaxAnnual,
      insuranceAnnual,
      utilitiesMonthly,
      maintenancePercent,
      propertyManagementPercent,
      nightlyRate,
      occupancyRate,
      cleaningFee,
      platformFeesPercent,
    } = inputs;

    // Calculate loan amount and monthly mortgage payment
    const downPayment = (purchasePrice * downPaymentPercent) / 100;
    const loanAmount = purchasePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyMortgagePayment =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate monthly operating expenses
    const monthlyPropertyTax = propertyTaxAnnual / 12;
    const monthlyInsurance = insuranceAnnual / 12;
    const monthlyMaintenance = (purchasePrice * maintenancePercent) / 100 / 12;

    // Calculate monthly revenue
    const nightsBooked = (30 * occupancyRate) / 100;
    const monthlyCleaningFees = cleaningFee * nightsBooked;
    const monthlyRevenue = nightlyRate * nightsBooked + monthlyCleaningFees;
    const monthlyPlatformFees = (monthlyRevenue * platformFeesPercent) / 100;
    const monthlyPropertyManagement = (monthlyRevenue * propertyManagementPercent) / 100;

    const monthlyOperatingExpenses =
      monthlyPropertyTax +
      monthlyInsurance +
      utilitiesMonthly +
      monthlyMaintenance +
      monthlyPropertyManagement;

    // Calculate cash flow and returns
    const monthlyCashFlow = monthlyRevenue - monthlyMortgagePayment - monthlyOperatingExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = (annualCashFlow / purchasePrice) * 100;
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;

    setResults({
      monthlyMortgagePayment,
      monthlyOperatingExpenses,
      monthlyRevenue,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
    });
  };

  const resetCalculator = () => {
    setInputs(defaultInputs);
    setResults(null);
  };

  const handleSaveAnalysis = async () => {
    if (!results) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveAnalysis({
        userId: 'mock-user-123',
        type: 'airbnb' as AnalysisType,
        inputs,
        results,
        title: title || inputs.propertyAddress || 'Untitled Analysis',
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
              value={inputs.propertyAddress}
              onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Purchase Price
            </label>
            <input
              type="number"
              value={inputs.purchasePrice}
              onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Down Payment (%)
            </label>
            <input
              type="number"
              value={inputs.downPaymentPercent}
              onChange={(e) => handleInputChange("downPaymentPercent", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange("interestRate", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Loan Term (years)
            </label>
            <input
              type="number"
              value={inputs.loanTerm}
              onChange={(e) => handleInputChange("loanTerm", e.target.value)}
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
              value={inputs.nightlyRate}
              onChange={(e) => handleInputChange("nightlyRate", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Occupancy Rate (%)
            </label>
            <input
              type="number"
              value={inputs.occupancyRate}
              onChange={(e) => handleInputChange("occupancyRate", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cleaning Fee
            </label>
            <input
              type="number"
              value={inputs.cleaningFee}
              onChange={(e) => handleInputChange("cleaningFee", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Platform Fees (%)
            </label>
            <input
              type="number"
              value={inputs.platformFeesPercent}
              onChange={(e) => handleInputChange("platformFeesPercent", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Property Tax (annual)
            </label>
            <input
              type="number"
              value={inputs.propertyTaxAnnual}
              onChange={(e) => handleInputChange("propertyTaxAnnual", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Insurance (annual)
            </label>
            <input
              type="number"
              value={inputs.insuranceAnnual}
              onChange={(e) => handleInputChange("insuranceAnnual", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Utilities (monthly)
            </label>
            <input
              type="number"
              value={inputs.utilitiesMonthly}
              onChange={(e) => handleInputChange("utilitiesMonthly", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Maintenance (%)
            </label>
            <input
              type="number"
              value={inputs.maintenancePercent}
              onChange={(e) => handleInputChange("maintenancePercent", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Property Management (%)
            </label>
            <input
              type="number"
              value={inputs.propertyManagementPercent}
              onChange={(e) => handleInputChange("propertyManagementPercent", e.target.value)}
              className="w-full px-3 py-2 bg-[#111] text-white placeholder-gray-400 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Investment Analysis</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Mortgage Payment</span>
            <span className="text-white font-medium">{formatCurrency(results?.monthlyMortgagePayment || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Operating Expenses</span>
            <span className="text-white font-medium">{formatCurrency(results?.monthlyOperatingExpenses || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Revenue</span>
            <span className="text-white font-medium">{formatCurrency(results?.monthlyRevenue || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Monthly Cash Flow</span>
            <span className="text-white font-medium">{formatCurrency(results?.monthlyCashFlow || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Annual Cash Flow</span>
            <span className="text-white font-medium">{formatCurrency(results?.annualCashFlow || 0)}</span>
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Cap Rate</span>
              <span className="text-[#2ecc71] font-bold text-xl">
                {formatPercentage(results?.capRate || 0)}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white font-semibold">Cash on Cash Return</span>
              <span className="text-[#2ecc71] font-bold text-xl">
                {formatPercentage(results?.cashOnCashReturn || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Title Inputs */}
      {activeTab === 'results' && results && (
        <div className="p-6 border-t border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Analysis Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={inputs.propertyAddress || 'Untitled Analysis'}
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

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="p-6 border-t border-gray-700">
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-[#2ecc71]/50"
          >
            Calculate Analysis
          </button>
        </div>
      </div>

      <ActionButtons
        onReset={resetCalculator}
        onSave={handleSaveAnalysis}
        saveDisabled={!results || isSaving}
      />
    </div>
  );
} 