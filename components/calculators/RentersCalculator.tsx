"use client";

import { useState, useEffect } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import type { RentalInputs, RentalAnalysisResults, CalculatorInputs } from "@/types/analysis";
import { saveAnalysis } from "@/lib/services/saveAnalysis";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/Toast";

interface RentersInputs {
  monthlyRent: number;
  securityDeposit: number;
  leaseTerm: number;
  utilitiesIncluded: boolean;
}

export default function RentersCalculator() {
  const { state, dispatch } = useCalculator();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputs: RentersInputs = {
    monthlyRent: state.rental?.monthlyRent ?? 0,
    securityDeposit: (state.rental as any)?.securityDeposit ?? 0,
    leaseTerm: (state.rental as any)?.leaseTerm ?? 12,
    utilitiesIncluded: (state.rental as any)?.utilitiesIncluded ?? false,
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("importedProperty");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const rentersInputs: RentalInputs = {
          propertyAddress: parsed.propertyAddress || "",
          purchasePrice: parsed.purchasePrice || 0,
          downPaymentPercent: parsed.downPaymentPercent || 20,
          loanTermYears: parsed.loanTermYears || 30,
          interestRate: parsed.interestRate || 5.5,
          closingCostsPercent: parsed.closingCostsPercent || 3,
          propertyTaxesYearly: parsed.propertyTaxesYearly || 0,
          insuranceCostMonthly: parsed.insuranceCostMonthly || 0,
          utilitiesMonthlyCost: parsed.utilitiesMonthlyCost || 0,
          maintenancePercent: parsed.maintenancePercent || 0,
          propertyManagementPercent: parsed.propertyManagementPercent || 0,
          monthlyRent: parsed.monthlyRent || 0,
          vacancyRatePercent: parsed.vacancyRatePercent || 5,
          capExReservePercent: parsed.capExReservePercent || 5,
          annualAppreciationPercent: parsed.annualAppreciationPercent || 3,
          annualRentIncreasePercent: parsed.annualRentIncreasePercent || 2,
          holdingPeriodYears: parsed.holdingPeriodYears || 5
        };
        dispatch({
          type: "SET_INPUTS",
          payload: {
            rental: rentersInputs,
          },
        });
        sessionStorage.removeItem("importedProperty");
      } catch (err) {
        console.error("Failed to load imported property:", err);
      }
    }
  }, [dispatch]);

  const handleInputChange = (
    field: keyof RentersInputs,
    value: string | number | boolean
  ) => {
    const rentalInputs: RentalInputs = {
      ...state.rental,
      monthlyRent: inputs.monthlyRent,
      securityDeposit: inputs.securityDeposit,
      leaseTerm: inputs.leaseTerm,
      utilitiesIncluded: inputs.utilitiesIncluded,
      [field]: value,
    } as RentalInputs;

    dispatch({
      type: "SET_INPUTS",
      payload: {
        rental: rentalInputs,
      },
    });
  };

  const calculateResults = () => {
    const results: RentalAnalysisResults = {
      type: "rental",
      monthlyCashFlow: inputs.monthlyRent,
      annualCashFlow: inputs.monthlyRent * 12,
      capRate: 0,
      cashOnCash: 0,
      roi: 0,
      totalCashInvestment: 0,
      netOperatingIncome: inputs.monthlyRent * 12,
      monthlyRevenue: inputs.monthlyRent,
      totalOperatingExpenses: 0,
      monthlyMortgagePayment: 0,
      breakEvenOccupancy: 0,
      irr: 0,
      grossRentMultiplier: 0,
      debtServiceCoverageRatio: 0
    };

    dispatch({
      type: "SET_RESULTS",
      payload: { rentalResults: results },
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      setToastMessage("Please sign in to save your analysis");
      return;
    }

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: session.user.id,
        type: "rental",
        inputs: state.rental as unknown as CalculatorInputs,
        results: state.rentalResults as RentalAnalysisResults,
        title: "Renters Analysis",
        notes: "",
      });
      setToastMessage("Analysis saved successfully");
    } catch (error) {
      setToastMessage("Failed to save analysis. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const results = state.rentalResults;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Renters Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={inputs.monthlyRent}
                  onChange={(e) =>
                    handleInputChange("monthlyRent", Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  value={inputs.securityDeposit}
                  onChange={(e) =>
                    handleInputChange("securityDeposit", Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseTerm">Lease Term (months)</Label>
                <Input
                  id="leaseTerm"
                  type="number"
                  value={inputs.leaseTerm}
                  onChange={(e) =>
                    handleInputChange("leaseTerm", Number(e.target.value))
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="utilitiesIncluded"
                  checked={inputs.utilitiesIncluded}
                  onChange={(e) =>
                    handleInputChange("utilitiesIncluded", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Label htmlFor="utilitiesIncluded">Utilities Included</Label>
              </div>
            </div>

            <div className="space-y-4">
              {results && (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Monthly Cash Flow
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${results.monthlyCashFlow.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Annual Cash Flow
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${results.annualCashFlow.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button onClick={calculateResults}>
              Calculate
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Analysis"}
            </Button>
          </div>

          {toastMessage && (
            <Toast
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

RentersCalculator.displayName = "RentersCalculator";
