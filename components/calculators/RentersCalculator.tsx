"use client";

import { useState, useEffect } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import type { RentalInputs, RentalAnalysisResults, RentersInputs } from "@/types/analysis";
import { saveAnalysis } from "@/lib/services/saveAnalysis";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/Toast";

export default function RentersCalculator() {
  const { state, dispatch } = useCalculator();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputs: RentersInputs = {
    propertyAddress: state.rental?.propertyAddress ?? "",
    purchasePrice: state.rental?.purchasePrice ?? 0,
    downPaymentPercent: state.rental?.downPaymentPercent ?? 20,
    loanTermYears: state.rental?.loanTermYears ?? 30,
    interestRate: state.rental?.interestRate ?? 5.5,
    closingCostsPercent: state.rental?.closingCostsPercent ?? 3,
    propertyTaxesYearly: state.rental?.propertyTaxesYearly ?? 0,
    insuranceCostMonthly: state.rental?.insuranceCostMonthly ?? 0,
    utilitiesMonthlyCost: state.rental?.utilitiesMonthlyCost ?? 0,
    maintenancePercent: state.rental?.maintenancePercent ?? 0,
    propertyManagementPercent: state.rental?.propertyManagementPercent ?? 0,
    monthlyRent: state.rental?.monthlyRent ?? 0,
    vacancyRatePercent: state.rental?.vacancyRatePercent ?? 5,
    capExReservePercent: state.rental?.capExReservePercent ?? 5,
    annualAppreciationPercent: state.rental?.annualAppreciationPercent ?? 3,
    annualRentIncreasePercent: state.rental?.annualRentIncreasePercent ?? 2,
    holdingPeriodYears: state.rental?.holdingPeriodYears ?? 5,
    hoa: state.rental?.hoa
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
      purchasePrice: inputs.purchasePrice,
      downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
      loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
      interestRate: inputs.interestRate,
      loanTerm: inputs.loanTermYears,
      monthlyRent: inputs.monthlyRent ?? 0,
      vacancyRate: inputs.vacancyRatePercent ?? 0,
      propertyTaxes: inputs.propertyTaxesYearly / 12,
      insurance: inputs.insuranceCostMonthly,
      hoaFees: inputs.hoa ?? 0,
      maintenance: inputs.purchasePrice * (inputs.maintenancePercent / 100) / 12,
      managementFees: inputs.monthlyRent ? inputs.monthlyRent * (inputs.propertyManagementPercent / 100) : 0,
      utilities: inputs.utilitiesMonthlyCost,
      otherExpenses: 0,
      monthlyMortgage: 0,
      totalMonthlyExpenses: 0,
      netOperatingIncome: (inputs.monthlyRent ?? 0) * 12,
      cashFlow: inputs.monthlyRent ?? 0,
      capRate: 0,
      roi: 0,
      breakEvenOccupancy: 0,
      cashOnCashReturn: 0,
      grossRentMultiplier: 0,
      debtServiceCoverageRatio: 0,
      monthlyCashFlow: inputs.monthlyRent ?? 0,
      annualCashFlow: (inputs.monthlyRent ?? 0) * 12
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
        inputs,
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
                  value={inputs.monthlyRent ?? 0}
              onChange={(e) =>
                handleInputChange("monthlyRent", Number(e.target.value))
              }
            />
          </div>
              <div className="space-y-2">
                <Label htmlFor="utilitiesMonthlyCost">Monthly Utilities Cost</Label>
                <Input
                  id="utilitiesMonthlyCost"
              type="number"
                  value={inputs.utilitiesMonthlyCost ?? 0}
              onChange={(e) =>
                    handleInputChange("utilitiesMonthlyCost", Number(e.target.value))
              }
            />
          </div>
              <div className="space-y-2">
                <Label htmlFor="propertyManagementPercent">Property Management %</Label>
                <Input
                  id="propertyManagementPercent"
              type="number"
                  value={inputs.propertyManagementPercent ?? 0}
              onChange={(e) =>
                    handleInputChange("propertyManagementPercent", Number(e.target.value))
              }
            />
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

