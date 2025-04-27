"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import { CalculatorInputs } from '@/types/analysis';
import { calculateAirbnbMetrics } from '@/lib/calculators/airbnb';
import ActionButtons from "@/components/ui/ActionButtons";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AirbnbCalculator() {
  const { state, dispatch } = useCalculator();
  const [showAllFields, setShowAllFields] = useState(false);

  // Default state is now correctly typed to match the calculator context expectations
  const [inputs, setInputs] = useState<CalculatorInputs>({
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
    const results = calculateAirbnbMetrics(inputs);
    // Properly structure the results to match our AnalysisResults type
    dispatch({ 
      type: 'SET_RESULTS', 
      results: { 
        type: 'airbnb', 
        data: results 
      } 
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
    // Save the inputs to the calculator context
    dispatch({ type: 'SET_INPUTS', inputs });
    calculateResults();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Airbnb Investment Calculator</CardTitle>
          <CardDescription>
            Calculate the potential returns of an Airbnb rental property investment
          </CardDescription>
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
    </div>
  );
}

// Add displayName property
AirbnbCalculator.displayName = "AirbnbCalculator"; 