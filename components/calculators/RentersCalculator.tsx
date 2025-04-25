"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorInput, CalculatorResults } from '@/types/calculator';
import { calculateRentersMetrics } from '@/lib/calculators/renters';
import { cn } from '@/lib/utils';

const defaultInputs: CalculatorInput = {
  propertyAddress: '',
  purchasePrice: 0,
  downPaymentPercent: 20,
  interestRate: 7.5,
  loanTerm: 30,
  closingCosts: 0,
  propertyTaxAnnual: 0,
  insuranceAnnual: 0,
  utilitiesMonthly: 0,
  maintenancePercent: 1,
  propertyManagementPercent: 10,
  monthlyRent: 0,
  vacancyRatePercent: 5,
  capExReservePercent: 5,
  annualAppreciationPercent: 3,
  annualRentIncreasePercent: 2,
  holdingPeriodYears: 5,
  nightlyRate: 0,
  occupancyRate: 0,
  cleaningFee: 0,
  platformFeesPercent: 3
};

export function RentersCalculator() {
  const [inputs, setInputs] = useState<CalculatorInput>(defaultInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleInputChange = (field: keyof CalculatorInput, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleCalculate = () => {
    const calculatedResults = calculateRentersMetrics(inputs);
    setResults(calculatedResults);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={inputs.purchasePrice}
              onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
              className={cn(
                "mt-1",
                inputs.purchasePrice === 0 && "border-red-500"
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="downPaymentPercent">Down Payment %</Label>
            <Input
              id="downPaymentPercent"
              type="number"
              value={inputs.downPaymentPercent}
              onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="interestRate">Interest Rate %</Label>
            <Input
              id="interestRate"
              type="number"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nightlyRate">Nightly Rate</Label>
            <Input
              id="nightlyRate"
              type="number"
              value={inputs.nightlyRate}
              onChange={(e) => handleInputChange('nightlyRate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="occupancyRate">Occupancy Rate %</Label>
            <Input
              id="occupancyRate"
              type="number"
              value={inputs.occupancyRate}
              onChange={(e) => handleInputChange('occupancyRate', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="propertyTaxAnnual">Annual Property Tax</Label>
            <Input
              id="propertyTaxAnnual"
              type="number"
              value={inputs.propertyTaxAnnual}
              onChange={(e) => handleInputChange('propertyTaxAnnual', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="insuranceAnnual">Annual Insurance</Label>
            <Input
              id="insuranceAnnual"
              type="number"
              value={inputs.insuranceAnnual}
              onChange={(e) => handleInputChange('insuranceAnnual', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="utilitiesMonthly">Monthly Utilities</Label>
            <Input
              id="utilitiesMonthly"
              type="number"
              value={inputs.utilitiesMonthly}
              onChange={(e) => handleInputChange('utilitiesMonthly', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="maintenancePercent">Maintenance %</Label>
            <Input
              id="maintenancePercent"
              type="number"
              value={inputs.maintenancePercent}
              onChange={(e) => handleInputChange('maintenancePercent', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="propertyManagementPercent">Property Management %</Label>
            <Input
              id="propertyManagementPercent"
              type="number"
              value={inputs.propertyManagementPercent}
              onChange={(e) => handleInputChange('propertyManagementPercent', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleCalculate}
          className="w-full md:w-auto"
          disabled={inputs.purchasePrice === 0}
        >
          Calculate
        </Button>
      </div>

      {results && (
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Mortgage Payment</p>
              <p className="text-lg font-medium">${results.monthlyMortgagePayment.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cash Flow</p>
              <p className="text-lg font-medium">${results.monthlyCashFlow.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Annual Cash Flow</p>
              <p className="text-lg font-medium">${results.annualCashFlow.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cash on Cash Return</p>
              <p className="text-lg font-medium">{results.cashOnCashReturn.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cap Rate</p>
              <p className="text-lg font-medium">{results.capRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-lg font-medium">${results.monthlyRevenue?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 