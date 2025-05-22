"use client";

import { useState } from "react";
import { useCalculator } from '@/context/CalculatorContext';
import type { WholesaleInputs, WholesaleAnalysisResults } from '@/types/analysis';
import ActionButtons from "@/components/ui/ActionButtons";
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { saveAnalysis } from '@/lib/services/saveAnalysis';
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/Toast";

export default function WholesaleCalculator() {
  const { state, dispatch } = useCalculator();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputs = state.wholesale || {
    propertyAddress: "",
    purchasePrice: 0,
    closingCostsPercent: 0,
    propertyManagementPercent: 0,
    maintenancePercent: 0,
    insuranceCostMonthly: 0,
    propertyTaxesYearly: 0,
    utilitiesMonthlyCost: 0,
    hoa: 0,
    downPaymentPercent: 0,
    loanTermYears: 0,
    interestRate: 0,
    estimatedRepairCost: 0,
    arv: 0,
    assignmentFee: 0,
    maxOfferPercent: 0,
  };

  const updateInput = (field: keyof WholesaleInputs, value: number | string) => {
    dispatch({
      type: 'SET_INPUTS',
      payload: {
        wholesale: {
          ...inputs,
          [field]: value
        }
      }
    });
  };

  const calculateResults = () => {
    try {
      const {
        purchasePrice,
        closingCostsPercent,
        estimatedRepairCost,
        arv,
        assignmentFee,
      } = inputs;

      if (!purchasePrice || !arv) {
        setToastMessage("Please fill in all required fields");
        return;
      }

      const closingCosts = (purchasePrice * closingCostsPercent) / 100;
      const totalInvestment = purchasePrice + estimatedRepairCost + assignmentFee + closingCosts;
      const profit = arv - totalInvestment;
      const roi = (profit / totalInvestment) * 100;

      const result: WholesaleAnalysisResults = {
        type: 'wholesale',
        purchasePrice: inputs.purchasePrice,
        estimatedRepairCost: inputs.estimatedRepairCost,
        arv: inputs.arv,
        assignmentFee: inputs.assignmentFee,
        closingCosts: inputs.purchasePrice * (inputs.closingCostsPercent / 100),
        holdingCosts: inputs.purchasePrice * 0.01,
        marketingCosts: inputs.purchasePrice * 0.005,
        totalInvestment: totalInvestment,
        profit: profit,
        returnOnInvestment: roi,
        profitMargin: (profit / inputs.arv) * 100,
        roi: roi,
        repairCosts: inputs.estimatedRepairCost
      };

      dispatch({ type: 'SET_RESULTS', payload: { wholesaleResults: result } });
    } catch (error) {
      setToastMessage("An error occurred while calculating results");
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      setToastMessage("Please sign in to save your analysis");
      return;
    }

    setIsLoading(true);
    try {
      await saveAnalysis({
        userId: session.user.id,
        type: "wholesale",
        inputs: inputs as WholesaleInputs,
        results: state.wholesaleResults as WholesaleAnalysisResults,
        title: "Wholesale Analysis",
        notes: "",
      });
      setToastMessage("Analysis saved successfully");
    } catch (error) {
      setToastMessage("Failed to save analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wholesale Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateResults();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  type="text"
                  value={inputs.propertyAddress}
                  onChange={(e) => updateInput('propertyAddress', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arv">After Repair Value</Label>
                <Input
                  id="arv"
                  type="number"
                  value={inputs.arv}
                  onChange={(e) => updateInput('arv', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(e) => updateInput('purchasePrice', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedRepairCost">Repair Costs</Label>
                <Input
                  id="estimatedRepairCost"
                  type="number"
                  value={inputs.estimatedRepairCost}
                  onChange={(e) => updateInput('estimatedRepairCost', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deal Costs</h3>
              <div className="space-y-2">
                <Label htmlFor="assignmentFee">Assignment Fee</Label>
                <Input
                  id="assignmentFee"
                  type="number"
                  value={inputs.assignmentFee}
                  onChange={(e) => updateInput('assignmentFee', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closingCostsPercent">Closing Costs (%)</Label>
                <Input
                  id="closingCostsPercent"
                  type="number"
                  value={inputs.closingCostsPercent}
                  onChange={(e) => updateInput('closingCostsPercent', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxOfferPercent">Max Offer (%)</Label>
                <Input
                  id="maxOfferPercent"
                  type="number"
                  value={inputs.maxOfferPercent}
                  onChange={(e) => updateInput('maxOfferPercent', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading}>
              Calculate
            </Button>
          </div>

          <ActionButtons
            onReset={() => dispatch({ type: 'RESET_CALCULATOR' })}
            onSave={handleSave}
            saveDisabled={!state.wholesaleResults || isLoading}
          />
        </form>

        {state.wholesaleResults && (
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
            <div className="space-y-4">
              <Stat label="Total Investment" value={formatCurrency(state.wholesaleResults.totalInvestment)} />
              <Stat label="Profit" value={formatCurrency(state.wholesaleResults.profit)} />
              <Stat label="ROI" value={formatPercentage(state.wholesaleResults.roi)} isPositive />
            </div>
          </div>
        )}

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

export function Stat({ label, value, isPositive = false }: { label: string; value: string; isPositive?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${isPositive ? "text-green-500" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
