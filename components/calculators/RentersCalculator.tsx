"use client";

import { useState, useEffect, useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { calculateRentersMetrics } from '@/lib/calculators/renters';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/button';
import { CalculatorInput, CalculatorResults } from '@/types/calculator';

const defaultInputs: CalculatorInput = {
  propertyAddress: '',
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
  nightlyRate: 0,
  occupancyRate: 0,
  cleaningFee: 0,
  platformFeesPercent: 0,
  monthlyRent: 2000,
  vacancyRatePercent: 5,
  capExReservePercent: 5
};

export function RentersCalculator() {
  const { state, dispatch } = useCalculator();
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof CalculatorInput, value: string) => {
    dispatch({
      type: 'SET_INPUT',
      field,
      value: parseFloat(value) || 0
    });
  }, [dispatch]);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    try {
      const results: CalculatorResults = calculateRentersMetrics(state.calculatorInputs);
      dispatch({ type: 'SET_RESULTS', results });
    } catch (error) {
      console.error('Error calculating metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [state.calculatorInputs, dispatch]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rental Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputField
          label="Property Address"
          type="text"
          value={state.calculatorInputs.propertyAddress || ''}
          onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
        />
        <InputField
          label="Purchase Price"
          type="number"
          value={state.calculatorInputs.purchasePrice || ''}
          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
        />
        <InputField
          label="Down Payment %"
          type="number"
          value={state.calculatorInputs.downPaymentPercent || ''}
          onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
        />
        <InputField
          label="Interest Rate %"
          type="number"
          value={state.calculatorInputs.interestRate || ''}
          onChange={(e) => handleInputChange('interestRate', e.target.value)}
        />
        <InputField
          label="Loan Term (years)"
          type="number"
          value={state.calculatorInputs.loanTerm || ''}
          onChange={(e) => handleInputChange('loanTerm', e.target.value)}
        />
        <InputField
          label="Closing Costs"
          type="number"
          value={state.calculatorInputs.closingCosts || ''}
          onChange={(e) => handleInputChange('closingCosts', e.target.value)}
        />
        <InputField
          label="Property Tax (annual)"
          type="number"
          value={state.calculatorInputs.propertyTaxAnnual || ''}
          onChange={(e) => handleInputChange('propertyTaxAnnual', e.target.value)}
        />
        <InputField
          label="Insurance (annual)"
          type="number"
          value={state.calculatorInputs.insuranceAnnual || ''}
          onChange={(e) => handleInputChange('insuranceAnnual', e.target.value)}
        />
        <InputField
          label="Utilities (monthly)"
          type="number"
          value={state.calculatorInputs.utilitiesMonthly || ''}
          onChange={(e) => handleInputChange('utilitiesMonthly', e.target.value)}
        />
        <InputField
          label="Maintenance %"
          type="number"
          value={state.calculatorInputs.maintenancePercent || ''}
          onChange={(e) => handleInputChange('maintenancePercent', e.target.value)}
        />
        <InputField
          label="Property Management %"
          type="number"
          value={state.calculatorInputs.propertyManagementPercent || ''}
          onChange={(e) => handleInputChange('propertyManagementPercent', e.target.value)}
        />
        <InputField
          label="Monthly Rent"
          type="number"
          value={state.calculatorInputs.monthlyRent || ''}
          onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
        />
        <InputField
          label="Vacancy Rate %"
          type="number"
          value={state.calculatorInputs.vacancyRatePercent || ''}
          onChange={(e) => handleInputChange('vacancyRatePercent', e.target.value)}
        />
        <InputField
          label="CapEx Reserve %"
          type="number"
          value={state.calculatorInputs.capExReservePercent || ''}
          onChange={(e) => handleInputChange('capExReservePercent', e.target.value)}
        />
      </div>

      <Button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </Button>
    </div>
  );
} 