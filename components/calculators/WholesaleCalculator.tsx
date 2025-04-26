"use client";

import { useState } from "react";
import ActionButtons from "@/components/ui/ActionButtons";
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';

interface WholesaleInputs {
  afterRepairValue: number;
  purchasePrice: number;
  repairCosts: number;
  assignmentFee: number;
  closingCosts: number;
  miscHoldingCosts: number;
}

interface WholesaleResults {
  totalInvestment: number;
  profit: number;
  roi: number;
}

const defaultInputs: WholesaleInputs = {
  afterRepairValue: 300000,
  purchasePrice: 200000,
  repairCosts: 30000,
  assignmentFee: 10000,
  closingCosts: 5000,
  miscHoldingCosts: 0,
};

export default function WholesaleCalculator() {
  const [inputs, setInputs] = useState<WholesaleInputs>(defaultInputs);
  const [results, setResults] = useState<WholesaleResults | null>(null);

  const handleInputChange = (field: keyof WholesaleInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const calculateResults = () => {
    const {
      afterRepairValue,
      purchasePrice,
      repairCosts,
      assignmentFee,
      closingCosts,
      miscHoldingCosts,
    } = inputs;

    const totalInvestment = purchasePrice + repairCosts + assignmentFee + closingCosts + miscHoldingCosts;
    const profit = afterRepairValue - totalInvestment;
    const roi = (profit / totalInvestment) * 100;

    setResults({
      totalInvestment,
      profit,
      roi,
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
                After Repair Value
              </label>
              <input
                type="number"
                value={inputs.afterRepairValue}
                onChange={(e) => handleInputChange("afterRepairValue", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Repair Costs
              </label>
              <input
                type="number"
                value={inputs.repairCosts}
                onChange={(e) => handleInputChange("repairCosts", e.target.value)}
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
                value={inputs.assignmentFee}
                onChange={(e) => handleInputChange("assignmentFee", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Closing Costs
              </label>
              <input
                type="number"
                value={inputs.closingCosts}
                onChange={(e) => handleInputChange("closingCosts", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Misc Holding Costs
              </label>
              <input
                type="number"
                value={inputs.miscHoldingCosts}
                onChange={(e) => handleInputChange("miscHoldingCosts", e.target.value)}
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
          onReset={resetCalculator}
          onSave={handleSave}
          saveDisabled={!results}
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