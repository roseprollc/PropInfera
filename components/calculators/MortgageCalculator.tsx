"use client";

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import type { MortgageInputs, MortgageAnalysisResults } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { saveAnalysis } from '@/lib/services/saveAnalysis';
import ActionButtons from "@/components/ui/ActionButtons";

const defaultInputs: MortgageInputs = {
  propertyAddress: '',
  purchasePrice: 300000,
  downPaymentPercent: 20,
  loanTermYears: 30,
  interestRate: 6.5,
  propertyTaxesYearly: 3000,
  insuranceCostMonthly: 100,
  hoa: 0,
  maintenancePercent: 1,
  propertyManagementPercent: 0,
  closingCostsPercent: 3,
  utilitiesMonthlyCost: 0
};

function MortgageCalculator() {
  const { dispatch, state } = useCalculator();
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [results, setResults] = useState<MortgageAnalysisResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.type === 'mortgage' && state.inputs.mortgage) {
      setInputs(state.inputs.mortgage);
    }
  }, [state]);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const calculateResults = () => {
    const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100);
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTermYears * 12;
    const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const results: MortgageAnalysisResults = {
      type: 'mortgage',
      monthlyPayment,
      principalAndInterest: monthlyPayment,
      totalMonthlyPayment: monthlyPayment + (inputs.propertyTaxesYearly / 12) + inputs.insuranceCostMonthly + (inputs.hoa || 0)
    };

    setResults(results);
    dispatch({
      type: 'SET_RESULTS',
      payload: results
    });

    dispatch({
      type: 'SET_INPUTS',
      payload: { type: 'mortgage', inputs }
    });

    toast.success('Mortgage analysis completed!');
  };

  const handleSave = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: 'mock-user-123',
        type: 'mortgage',
        inputs: inputs,
        results: results,
        title: inputs.propertyAddress || 'Untitled Analysis',
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
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={inputs.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
              <Input
                id="downPaymentPercent"
                type="number"
                value={inputs.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTermYears">Loan Term (years)</Label>
              <Input
                id="loanTermYears"
                type="number"
                value={inputs.loanTermYears}
                onChange={(e) => handleInputChange('loanTermYears', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyTaxesYearly">Annual Property Tax</Label>
              <Input
                id="propertyTaxesYearly"
                type="number"
                value={inputs.propertyTaxesYearly}
                onChange={(e) => handleInputChange('propertyTaxesYearly', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceCostMonthly">Monthly Insurance</Label>
              <Input
                id="insuranceCostMonthly"
                type="number"
                value={inputs.insuranceCostMonthly}
                onChange={(e) => handleInputChange('insuranceCostMonthly', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoa">Monthly HOA Fees</Label>
              <Input
                id="hoa"
                type="number"
                value={inputs.hoa}
                onChange={(e) => handleInputChange('hoa', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenancePercent">Monthly Maintenance</Label>
              <Input
                id="maintenancePercent"
                type="number"
                value={inputs.maintenancePercent}
                onChange={(e) => handleInputChange('maintenancePercent', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyManagementPercent">Management Fees (%)</Label>
              <Input
                id="propertyManagementPercent"
                type="number"
                value={inputs.propertyManagementPercent}
                onChange={(e) => handleInputChange('propertyManagementPercent', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingCostsPercent">Closing Costs (%)</Label>
              <Input
                id="closingCostsPercent"
                type="number"
                value={inputs.closingCostsPercent}
                onChange={(e) => handleInputChange('closingCostsPercent', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utilitiesMonthlyCost">Monthly Utilities</Label>
              <Input
                id="utilitiesMonthlyCost"
                type="number"
                value={inputs.utilitiesMonthlyCost}
                onChange={(e) => handleInputChange('utilitiesMonthlyCost', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={calculateResults}>Calculate</Button>
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Monthly Payment</span>
              <span className="text-white font-medium">{formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Principal and Interest</span>
              <span className="text-white font-medium">{formatCurrency(results.principalAndInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Monthly Payment</span>
              <span className="text-white font-medium">{formatCurrency(results.totalMonthlyPayment)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ActionButtons
          onReset={() => dispatch({ type: 'RESET_CALCULATOR' })}
          onSave={handleSave}
          saveDisabled={!results || isSaving}
        />
      </CardContent>
    </Card>
  );
}

MortgageCalculator.displayName = "MortgageCalculator";

export { MortgageCalculator };