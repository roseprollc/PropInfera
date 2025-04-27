"use client";

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { MortgageInputs, MortgageResults } from '@/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { saveAnalysis } from '@/lib/services/saveAnalysis';
import ActionButtons from "@/components/ui/ActionButtons";

const defaultInputs: MortgageInputs = {
  purchasePrice: 300000,
  downPayment: 20,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTax: 3000,
  insurance: 1200,
  hoaFees: 0,
  maintenance: 100,
  vacancyRate: 5,
  managementFees: 0,
  closingCosts: 8000,
  monthlyRent: 2000,
  appreciationRate: 3
};

export default function MortgageCalculator() {
  const { dispatch, state } = useCalculator();
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [results, setResults] = useState<MortgageResults | null>(null);
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
    const loanAmount = inputs.purchasePrice * (1 - inputs.downPayment / 100);
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;
    const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const totalMonthlyExpenses = monthlyPayment + (inputs.propertyTax / 12) + (inputs.insurance / 12) + inputs.hoaFees + inputs.maintenance;
    const vacancyLoss = (inputs.monthlyRent * inputs.vacancyRate / 100);
    const managementFees = inputs.monthlyRent * inputs.managementFees / 100;
    const monthlyOperatingExpenses = totalMonthlyExpenses + vacancyLoss + managementFees;
    
    const annualCashFlow = (inputs.monthlyRent - monthlyOperatingExpenses) * 12;
    const totalInvestment = (inputs.purchasePrice * inputs.downPayment / 100) + inputs.closingCosts;
    const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;
    
    const results: MortgageResults = {
      type: 'mortgage',
      monthlyPayment,
      totalInvestment,
      annualCashFlow,
      cashOnCashReturn,
      capRate: (annualCashFlow / inputs.purchasePrice) * 100,
      netOperatingIncome: inputs.monthlyRent * 12 - (monthlyOperatingExpenses * 12),
      grossRentMultiplier: inputs.purchasePrice / (inputs.monthlyRent * 12),
      internalRateOfReturn: 0, // This would require more complex calculation
      totalReturn: 0, // This would require more complex calculation
      breakEvenPoint: monthlyOperatingExpenses / inputs.monthlyRent,
      loanAmount,
      totalInterest: (monthlyPayment * numberOfPayments) - loanAmount,
      totalCost: inputs.purchasePrice + inputs.closingCosts + ((monthlyPayment * numberOfPayments) - loanAmount),
      equityBuildUp: 0, // This would require amortization schedule
      amortizationSchedule: [] // This would require full amortization calculation
    };

    setResults(results);
    dispatch({
      type: 'SET_RESULTS',
      payload: results
    });

    dispatch({
      type: 'SET_INPUTS',
      payload: { mortgage: inputs }
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
              <Label htmlFor="downPayment">Down Payment (%)</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
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
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={inputs.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyTax">Annual Property Tax</Label>
              <Input
                id="propertyTax"
                type="number"
                value={inputs.propertyTax}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Annual Insurance</Label>
              <Input
                id="insurance"
                type="number"
                value={inputs.insurance}
                onChange={(e) => handleInputChange('insurance', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoaFees">Monthly HOA Fees</Label>
              <Input
                id="hoaFees"
                type="number"
                value={inputs.hoaFees}
                onChange={(e) => handleInputChange('hoaFees', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance">Monthly Maintenance</Label>
              <Input
                id="maintenance"
                type="number"
                value={inputs.maintenance}
                onChange={(e) => handleInputChange('maintenance', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
              <Input
                id="vacancyRate"
                type="number"
                value={inputs.vacancyRate}
                onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managementFees">Management Fees (%)</Label>
              <Input
                id="managementFees"
                type="number"
                value={inputs.managementFees}
                onChange={(e) => handleInputChange('managementFees', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingCosts">Closing Costs</Label>
              <Input
                id="closingCosts"
                type="number"
                value={inputs.closingCosts}
                onChange={(e) => handleInputChange('closingCosts', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={inputs.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="appreciationRate">Annual Appreciation Rate (%)</Label>
            <Input
              id="appreciationRate"
              type="number"
              value={inputs.appreciationRate}
              onChange={(e) => handleInputChange('appreciationRate', e.target.value)}
            />
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
              <span className="text-gray-300">Total Investment</span>
              <span className="text-white font-medium">{formatCurrency(results.totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Annual Cash Flow</span>
              <span className="text-white font-medium">{formatCurrency(results.annualCashFlow)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Cash on Cash Return</span>
              <span className="text-white font-medium">{formatCurrency(results.cashOnCashReturn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Cap Rate</span>
              <span className="text-white font-medium">{formatCurrency(results.capRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Net Operating Income</span>
              <span className="text-white font-medium">{formatCurrency(results.netOperatingIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gross Rent Multiplier</span>
              <span className="text-white font-medium">{formatCurrency(results.grossRentMultiplier)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Break Even Point</span>
              <span className="text-white font-medium">{formatCurrency(results.breakEvenPoint)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Interest</span>
              <span className="text-white font-medium">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Cost</span>
              <span className="text-white font-medium">{formatCurrency(results.totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Equity Build Up</span>
              <span className="text-white font-medium">{formatCurrency(results.equityBuildUp)}</span>
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