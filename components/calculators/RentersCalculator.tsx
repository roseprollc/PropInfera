"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { CalculatorInputs, RentersAnalysisResults, CalculatorType } from "@/types/analysis";

interface RentersInputs extends CalculatorInputs {
  monthlyRent: number;
  securityDeposit: number;
  leaseTerm: number;
  utilitiesIncluded: boolean;
}

export function RentersCalculator() {
  const { state, dispatch } = useCalculator();
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof RentersInputs, value: string | number) => {
    dispatch({ type: "SET_INPUT", field, value });
  };

  const calculateResults = () => {
    const inputs = state.calculatorInputs as RentersInputs;
    const results: RentersAnalysisResults = {
      monthlyCashFlow: inputs.monthlyRent,
      annualCashFlow: inputs.monthlyRent * 12,
      monthlyRevenue: inputs.monthlyRent,
    };
    dispatch({ type: "SET_RESULTS", results: { type: "renters", data: results } });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const analysis = {
        type: "renters" as const,
        inputs: state.calculatorInputs,
        results: state.results,
      };
      // TODO: Implement save functionality
    } catch (error) {
      console.error("Error saving analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const results = state.results?.type === "renters" ? state.results.data : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
            <input
              type="number"
              value={state.calculatorInputs.monthlyRent}
              onChange={(e) => handleInputChange("monthlyRent", Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Security Deposit</label>
            <input
              type="number"
              value={state.calculatorInputs.securityDeposit}
              onChange={(e) => handleInputChange("securityDeposit", Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lease Term (months)</label>
            <input
              type="number"
              value={state.calculatorInputs.leaseTerm}
              onChange={(e) => handleInputChange("leaseTerm", Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={state.calculatorInputs.utilitiesIncluded}
                onChange={(e) => handleInputChange("utilitiesIncluded", e.target.checked ? 1 : 0)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Utilities Included</span>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          {results && (
            <>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monthly Cash Flow</h3>
                <p className="text-2xl font-bold text-green-600">${results.monthlyCashFlow.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Annual Cash Flow</h3>
                <p className="text-2xl font-bold text-green-600">${results.annualCashFlow.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-blue-600">${results.monthlyRevenue.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={calculateResults}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Analysis"}
        </button>
      </div>
    </div>
  );
}

RentersCalculator.displayName = "RentersCalculator"; 