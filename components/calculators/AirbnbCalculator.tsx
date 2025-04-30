"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AirbnbInputs, MonthlyBreakdown } from "@/types/analysis";
import { calculateAirbnbMetrics } from "@/lib/calculators/airbnb";
import ActionButtons from "@/components/ui/ActionButtons";

const defaultInputs: AirbnbInputs = {
  propertyAddress: "",
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
  holdingPeriodYears: 5,
};

export default function AirbnbCalculator() {
  const { dispatch } = useCalculator();
  const [inputs, setInputs] = useState<AirbnbInputs>(defaultInputs);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "propertyAddress" ? value : parseFloat(value) || 0,
    }));
  };

  const validateInputs = (inputs: AirbnbInputs): boolean => {
    return (
      inputs.purchasePrice > 0 &&
      inputs.downPaymentPercent >= 0 &&
      inputs.loanTermYears > 0 &&
      inputs.interestRate >= 0 &&
      inputs.closingCostsPercent >= 0 &&
      inputs.averageNightlyRate >= 0 &&
      inputs.occupancyRatePercent >= 0 &&
      inputs.occupancyRatePercent <= 100
    );
  };

  const handleCalculate = () => {
    if (!validateInputs(inputs)) {
      alert("Please check your inputs. Some required fields are missing or invalid.");
      return;
    }

    const metrics = calculateAirbnbMetrics(inputs);
    const monthlyBreakdown: MonthlyBreakdown[] = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString("default", { month: "long" }),
      income: metrics.monthlyAirbnbIncome,
      expenses: metrics.totalOperatingExpenses,
      cashFlow: metrics.monthlyAirbnbIncome - metrics.totalOperatingExpenses,
      occupancyRate: inputs.occupancyRatePercent / 100,
    }));

    dispatch({ type: "SET_INPUTS", payload: { airbnb: inputs } });
    dispatch({
      type: "SET_RESULTS",
      payload: {
        airbnbResults: {
          ...metrics,
          type: "airbnb",
          monthlyBreakdown,
          averageDailyRate: inputs.averageNightlyRate,
        },
      },
    });
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    dispatch({ type: "RESET_CALCULATOR" });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCalculate();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "propertyAddress",
                    "purchasePrice",
                    "downPaymentPercent",
                    "interestRate",
                    "loanTermYears",
                    "closingCostsPercent",
                    "averageNightlyRate",
                    "occupancyRatePercent",
                  ].map((key) => (
                    <div className="space-y-2" key={key}>
                      <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</Label>
                      <Input
                        id={key}
                        name={key}
                        type={key === "propertyAddress" ? "text" : "number"}
                        value={String(inputs[key as keyof AirbnbInputs] ?? "")}
                        onChange={handleInputChange}
                        placeholder={key}
                      />
                    </div>
                  ))}
                </div>

                <ActionButtons onReset={handleReset} onSave={handleCalculate} />
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>{/* Reserved for future settings */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

AirbnbCalculator.displayName = "AirbnbCalculator";
