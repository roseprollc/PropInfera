"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import { CalculatorInputs, MortgageAnalysisResults } from '@/types/analysis';
import ActionButtons from "@/components/ui/ActionButtons";
import { saveAnalysis } from '@/lib/services/saveAnalysis';

interface MortgageInputs extends CalculatorInputs {
  hoaFees: number;
}

const defaultInputs: MortgageInputs = {
  propertyAddress: '',
  purchasePrice: 300000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  closingCosts: 9000,
  propertyTaxAnnual: 3000,
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
  nightlyRate: 0,
  occupancyRate: 0,
  cleaningFee: 0,
  platformFeesPercent: 0,
  afterRepairValue: 0,
  repairCosts: 0,
  assignmentFee: 0,
  miscHoldingCosts: 0,
  hoaFees: 0
};

export function MortgageCalculator() {
  const { state, dispatch } = useCalculator();
  const [results, setResults] = useState<MortgageAnalysisResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof CalculatorInputs, value: number | string) => {
    dispatch({ type: 'SET_INPUT', field, value });
  };

  const calculateResults = () => {
    const {
      purchasePrice,
      downPaymentPercent,
      loanTerm,
      interestRate,
      propertyTaxAnnual,
      insuranceAnnual,
      hoaFees,
    } = state.calculatorInputs as MortgageInputs;

    const downPayment = (purchasePrice * downPaymentPercent) / 100;
    const loanAmount = purchasePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly principal and interest
    const principalAndInterest =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total monthly payment
    const monthlyPropertyTax = propertyTaxAnnual / 12;
    const monthlyInsurance = insuranceAnnual / 12;
    const totalMonthlyPayment =
      principalAndInterest + monthlyPropertyTax + monthlyInsurance + hoaFees;

    const mortgageResults: MortgageAnalysisResults = {
      monthlyPayment: totalMonthlyPayment,
      principalAndInterest,
      totalMonthlyPayment,
    };

    setResults(mortgageResults);
    dispatch({ type: 'SET_RESULTS', results: { type: 'mortgage', data: mortgageResults } });
  };

  const handleSave = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: 'mock-user-123',
        type: 'mortgage',
        inputs: state.calculatorInputs,
        results: { type: 'mortgage', data: results },
        title: state.calculatorInputs.propertyAddress || 'Untitled Analysis',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
            <h3 className="text-lg font-semibold text-white">Loan Details</h3>
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
                Down Payment (%)
              </label>
              <input
                type="number"
                value={state.calculatorInputs.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Additional Costs</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Property Tax (annual)
              </label>
              <input
                type="number"
                value={state.calculatorInputs.propertyTaxAnnual}
                onChange={(e) => handleInputChange('propertyTaxAnnual', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Home Insurance (annual)
              </label>
              <input
                type="number"
                value={state.calculatorInputs.insuranceAnnual}
                onChange={(e) => handleInputChange('insuranceAnnual', Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                HOA Fees (monthly)
              </label>
              <input
                type="number"
                value={(state.calculatorInputs as MortgageInputs).hoaFees}
                onChange={(e) => handleInputChange('hoaFees', Number(e.target.value))}
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
            Calculate Payment
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
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Payment Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Principal & Interest</span>
              <span className="text-white font-medium">{formatCurrency(results.principalAndInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Property Tax</span>
              <span className="text-white font-medium">{formatCurrency(state.calculatorInputs.propertyTaxAnnual / 12)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Home Insurance</span>
              <span className="text-white font-medium">{formatCurrency(state.calculatorInputs.insuranceAnnual / 12)}</span>
            </div>
            {(state.calculatorInputs as MortgageInputs).hoaFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">HOA Fees</span>
                <span className="text-white font-medium">{formatCurrency((state.calculatorInputs as MortgageInputs).hoaFees)}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total Monthly Payment</span>
                <span className="text-[#2ecc71] font-bold text-xl">{formatCurrency(results.totalMonthlyPayment)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

MortgageCalculator.displayName = "MortgageCalculator"; 