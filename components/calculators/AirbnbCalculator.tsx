"use client";

import React, { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { AirbnbInputs, AnalysisResults } from '@/types/analysis';
import { calculateAirbnbMetrics } from '@/lib/calculators/airbnb';
import ActionButtons from "@/components/ui/ActionButtons";

const DynamicResults = dynamic(() => import('./Results'), {
  loading: () => <div className="flex items-center justify-center h-64">Loading results...</div>,
  ssr: false
});

const AirbnbCalculator: React.FC = () => {
  const { state, dispatch } = useCalculator();
  const [showAllFields, setShowAllFields] = useState(false);

  const [inputs, setInputs] = useState<AirbnbInputs>({
    propertyAddress: '',
    purchasePrice: 0,
    downPaymentPercent: 20,
    loanTermYears: 30,
    interestRate: 5.5,
    closingCostsPercent: 3,
    averageNightlyRate: 0,
    occupancyRatePercent: 0,
    propertyManagementPercent: 0,
    maintenancePercent: 0,
    cleaningFeePerStay: 0,
    averageStayDurationNights: 0,
    insuranceCostMonthly: 0,
    propertyTaxesYearly: 0,
    utilitiesMonthlyCost: 0,
    hoa: 0,
    annualAppreciationPercent: 2,
    holdingPeriodYears: 5
  });

  const calculateResults = () => {
    const metrics = calculateAirbnbMetrics(inputs);
    const results: AnalysisResults = {
      loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
      downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
      monthlyMortgagePayment: metrics.monthlyMortgagePayment,
      monthlyExpenses: metrics.monthlyExpenses,
      totalMonthlyPayment: metrics.monthlyMortgagePayment + metrics.monthlyExpenses
    };

    dispatch({ 
      type: 'SET_RESULTS', 
      payload: results
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name !== 'propertyAddress' ? parseFloat(value) : value;
    
    setInputs(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_INPUTS', payload: { airbnb: inputs } });
    calculateResults();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <Image
          src="/images/airbnb-hero.jpg"
          alt="Airbnb Calculator"
          width={1200}
          height={400}
          priority
          className="rounded-lg shadow-lg"
        />
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      name="propertyAddress"
                      value={inputs.propertyAddress || ''}
                      onChange={handleInputChange}
                      placeholder="Property Address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input
                      id="purchasePrice"
                      name="purchasePrice"
                      type="number"
                      value={inputs.purchasePrice || ''}
                      onChange={handleInputChange}
                      placeholder="Purchase Price"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                    <Input
                      id="downPaymentPercent"
                      name="downPaymentPercent"
                      type="number"
                      value={inputs.downPaymentPercent || ''}
                      onChange={handleInputChange}
                      placeholder="Down Payment Percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      value={inputs.interestRate || ''}
                      onChange={handleInputChange}
                      placeholder="Interest Rate"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loanTermYears">Loan Term (Years)</Label>
                    <Input
                      id="loanTermYears"
                      name="loanTermYears"
                      type="number"
                      value={inputs.loanTermYears || ''}
                      onChange={handleInputChange}
                      placeholder="Loan Term"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="closingCostsPercent">Closing Costs (%)</Label>
                    <Input
                      id="closingCostsPercent"
                      name="closingCostsPercent"
                      type="number"
                      value={inputs.closingCostsPercent || ''}
                      onChange={handleInputChange}
                      placeholder="Closing Costs Percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="averageNightlyRate">Average Nightly Rate ($)</Label>
                    <Input
                      id="averageNightlyRate"
                      name="averageNightlyRate"
                      type="number"
                      value={inputs.averageNightlyRate || ''}
                      onChange={handleInputChange}
                      placeholder="Average Nightly Rate"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="occupancyRatePercent">Occupancy Rate (%)</Label>
                    <Input
                      id="occupancyRatePercent"
                      name="occupancyRatePercent"
                      type="number"
                      value={inputs.occupancyRatePercent || ''}
                      onChange={handleInputChange}
                      placeholder="Occupancy Rate"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  {showAllFields && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="propertyManagementPercent">Property Management (%)</Label>
                        <Input
                          id="propertyManagementPercent"
                          name="propertyManagementPercent"
                          type="number"
                          value={inputs.propertyManagementPercent || ''}
                          onChange={handleInputChange}
                          placeholder="Property Management Percentage"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenancePercent">Maintenance (%)</Label>
                        <Input
                          id="maintenancePercent"
                          name="maintenancePercent"
                          type="number"
                          value={inputs.maintenancePercent || ''}
                          onChange={handleInputChange}
                          placeholder="Maintenance Percentage"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cleaningFeePerStay">Cleaning Fee per Stay ($)</Label>
                        <Input
                          id="cleaningFeePerStay"
                          name="cleaningFeePerStay"
                          type="number"
                          value={inputs.cleaningFeePerStay || ''}
                          onChange={handleInputChange}
                          placeholder="Cleaning Fee"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="averageStayDurationNights">Average Stay Duration (Nights)</Label>
                        <Input
                          id="averageStayDurationNights"
                          name="averageStayDurationNights"
                          type="number"
                          value={inputs.averageStayDurationNights || ''}
                          onChange={handleInputChange}
                          placeholder="Average Stay Duration"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="insuranceCostMonthly">Monthly Insurance ($)</Label>
                        <Input
                          id="insuranceCostMonthly"
                          name="insuranceCostMonthly"
                          type="number"
                          value={inputs.insuranceCostMonthly || ''}
                          onChange={handleInputChange}
                          placeholder="Monthly Insurance"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="propertyTaxesYearly">Yearly Property Taxes ($)</Label>
                        <Input
                          id="propertyTaxesYearly"
                          name="propertyTaxesYearly"
                          type="number"
                          value={inputs.propertyTaxesYearly || ''}
                          onChange={handleInputChange}
                          placeholder="Property Taxes"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="utilitiesMonthlyCost">Monthly Utilities ($)</Label>
                        <Input
                          id="utilitiesMonthlyCost"
                          name="utilitiesMonthlyCost"
                          type="number"
                          value={inputs.utilitiesMonthlyCost || ''}
                          onChange={handleInputChange}
                          placeholder="Monthly Utilities"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hoa">Monthly HOA ($)</Label>
                        <Input
                          id="hoa"
                          name="hoa"
                          type="number"
                          value={inputs.hoa || ''}
                          onChange={handleInputChange}
                          placeholder="Monthly HOA"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="annualAppreciationPercent">Annual Appreciation (%)</Label>
                        <Input
                          id="annualAppreciationPercent"
                          name="annualAppreciationPercent"
                          type="number"
                          value={inputs.annualAppreciationPercent || ''}
                          onChange={handleInputChange}
                          placeholder="Annual Appreciation"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="holdingPeriodYears">Holding Period (Years)</Label>
                        <Input
                          id="holdingPeriodYears"
                          name="holdingPeriodYears"
                          type="number"
                          value={inputs.holdingPeriodYears || ''}
                          onChange={handleInputChange}
                          placeholder="Holding Period"
                          min="0"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAllFields(!showAllFields)}
                  >
                    {showAllFields ? 'Show Less Fields' : 'Show All Fields'}
                  </Button>
                  
                  <ActionButtons />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* ... existing form content ... */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <DynamicResults />
      </div>
    </div>
  );
};

export default AirbnbCalculator;

// Add displayName property
AirbnbCalculator.displayName = "AirbnbCalculator";

export { AirbnbCalculator };