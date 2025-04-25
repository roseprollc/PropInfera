"use client";

import { useState } from "react";
import ActionButtons from "@/components/ui/ActionButtons";

interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
}

interface MortgageResults {
  monthlyPayment: number;
  principalAndInterest: number;
  totalMonthlyPayment: number;
}

const defaultInputs: MortgageInputs = {
  homePrice: 300000,
  downPayment: 60000,
  loanTerm: 30,
  interestRate: 6.5,
  propertyTax: 3000,
  homeInsurance: 1200,
  hoaFees: 0,
};

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [results, setResults] = useState<MortgageResults | null>(null);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const calculateResults = () => {
    const {
      homePrice,
      downPayment,
      loanTerm,
      interestRate,
      propertyTax,
      homeInsurance,
      hoaFees,
    } = inputs;

    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly principal and interest
    const principalAndInterest =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total monthly payment
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthlyPayment =
      principalAndInterest + monthlyPropertyTax + monthlyInsurance + hoaFees;

    setResults({
      monthlyPayment: totalMonthlyPayment,
      principalAndInterest,
      totalMonthlyPayment,
    });
  };

  const resetCalculator = () => {
    setInputs(defaultInputs);
    setResults(null);
  };

  const handleSave = () => {
    if (results) {
      console.log("Saving analysis:", { inputs, results });
      // TODO: Implement save functionality
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
                Home Price
              </label>
              <input
                type="number"
                value={inputs.homePrice}
                onChange={(e) => handleInputChange("homePrice", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Down Payment
              </label>
              <input
                type="number"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange("downPayment", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                value={inputs.propertyTax}
                onChange={(e) => handleInputChange("propertyTax", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Home Insurance (annual)
              </label>
              <input
                type="number"
                value={inputs.homeInsurance}
                onChange={(e) => handleInputChange("homeInsurance", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                HOA Fees (monthly)
              </label>
              <input
                type="number"
                value={inputs.hoaFees}
                onChange={(e) => handleInputChange("hoaFees", e.target.value)}
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
          onReset={resetCalculator}
          onSave={handleSave}
          saveDisabled={!results}
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
              <span className="text-white font-medium">{formatCurrency(inputs.propertyTax / 12)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Home Insurance</span>
              <span className="text-white font-medium">{formatCurrency(inputs.homeInsurance / 12)}</span>
            </div>
            {inputs.hoaFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">HOA Fees</span>
                <span className="text-white font-medium">{formatCurrency(inputs.hoaFees)}</span>
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