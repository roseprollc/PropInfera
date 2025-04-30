"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import type { MortgageInputs, MortgageAnalysisResults } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveAnalysis } from "@/lib/services/saveAnalysis";
import ActionButtons from "@/components/ui/ActionButtons";
import { useSession } from "next-auth/react";

const defaultInputs: MortgageInputs = {
  propertyAddress: "",
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
  utilitiesMonthlyCost: 0,
  pmi: 0,
  otherMonthlyExpenses: 0
};

export default function MortgageCalculator() {
  const { dispatch } = useCalculator();
  const { data: session } = useSession();
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [results, setResults] = useState<MortgageAnalysisResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    const parsed = value === "" ? 0 : parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const validateInputs = (inputs: MortgageInputs): boolean => {
    return (
      inputs.purchasePrice > 0 &&
      inputs.downPaymentPercent >= 0 &&
      inputs.loanTermYears > 0 &&
      inputs.interestRate >= 0 &&
      inputs.closingCostsPercent >= 0
    );
  };

  const calculateResults = () => {
    if (!validateInputs(inputs)) {
      toast({
        title: "Invalid Inputs",
        description: "Please check your inputs. Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100);
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTermYears * 12;

    const monthlyPayment =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const totalMonthlyPayment =
      monthlyPayment + inputs.insuranceCostMonthly + inputs.propertyTaxesYearly / 12 + (inputs.hoa ?? 0);

    const result: MortgageAnalysisResults = {
      type: "mortgage",
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      principalAndInterest: Math.round(monthlyPayment * 100) / 100,
      totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
    };

    setResults(result);

    dispatch({ type: "SET_INPUTS", payload: { mortgage: inputs } });
    dispatch({ type: "SET_RESULTS", payload: { mortgageResults: result } });

    toast({
      title: "Calculation complete",
      description: "Mortgage analysis results generated.",
    });
  };

  const handleSave = async () => {
    if (!results) {
      toast({
        title: "No Results",
        description: "Please calculate results before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Not Signed In",
        description: "Please sign in to save your analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveAnalysis({
        userId: session.user.id,
        type: "mortgage",
        inputs: inputs,
        results: results,
        title: inputs.propertyAddress || "Untitled Analysis",
        notes: "",
      });

      toast({
        title: "Success",
        description: "Analysis saved successfully",
      });
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Save Failed",
        description: "Unable to save analysis.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateResults();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField id="purchasePrice" label="Purchase Price" value={inputs.purchasePrice} onChange={handleInputChange} />
            <InputField id="downPaymentPercent" label="Down Payment (%)" value={inputs.downPaymentPercent} onChange={handleInputChange} />
            <InputField id="interestRate" label="Interest Rate (%)" value={inputs.interestRate} onChange={handleInputChange} />
            <InputField id="loanTermYears" label="Loan Term (Years)" value={inputs.loanTermYears} onChange={handleInputChange} />
            <InputField id="propertyTaxesYearly" label="Property Tax (Annual)" value={inputs.propertyTaxesYearly} onChange={handleInputChange} />
            <InputField id="insuranceCostMonthly" label="Insurance (Monthly)" value={inputs.insuranceCostMonthly} onChange={handleInputChange} />
            <InputField id="hoa" label="HOA Fees" value={inputs.hoa} onChange={handleInputChange} />
            <InputField id="utilitiesMonthlyCost" label="Utilities (Monthly)" value={inputs.utilitiesMonthlyCost} onChange={handleInputChange} />
            <InputField id="maintenancePercent" label="Maintenance (%)" value={inputs.maintenancePercent} onChange={handleInputChange} />
            <InputField id="propertyManagementPercent" label="Management (%)" value={inputs.propertyManagementPercent} onChange={handleInputChange} />
            <InputField id="closingCostsPercent" label="Closing Costs (%)" value={inputs.closingCostsPercent} onChange={handleInputChange} />
            <InputField id="pmi" label="PMI" value={inputs.pmi} onChange={handleInputChange} />
            <InputField id="otherMonthlyExpenses" label="Other Monthly Expenses" value={inputs.otherMonthlyExpenses} onChange={handleInputChange} />
          </div>

          <Button type="submit">Calculate</Button>

          {results && (
            <div className="mt-6 space-y-4">
              <Stat label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} />
              <Stat label="Principal & Interest" value={formatCurrency(results.principalAndInterest)} />
              <Stat label="Total Monthly Payment" value={formatCurrency(results.totalMonthlyPayment)} />
            </div>
          )}

          <ActionButtons
            onReset={() => dispatch({ type: "RESET_CALCULATOR" })}
            onSave={handleSave}
            saveDisabled={!results || isSaving}
          />
        </form>
      </CardContent>
    </Card>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
}: {
  id: keyof MortgageInputs;
  label: string;
  value: number | undefined;
  onChange: (field: keyof MortgageInputs, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

MortgageCalculator.displayName = "MortgageCalculator";
