import type { MortgageInputs, MortgageAnalysisResults } from "@/types/analysis";
import {
  calculateLoanAmount,
  calculateMonthlyMortgage,
} from "./amortization";

/**
 * Calculates the core mortgage analysis metrics
 */
export function calculateMortgageMetrics(inputs: MortgageInputs): MortgageAnalysisResults {
  // Convert MortgageInputs to the format expected by amortization functions
  const loanAmount = calculateLoanAmount({
    ...inputs,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: 0
  });
  
  const monthlyMortgage = calculateMonthlyMortgage({
    ...inputs,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: 0
  }, loanAmount);

  const totalMonthlyPayment =
    monthlyMortgage +
    inputs.insuranceCostMonthly +
    inputs.propertyTaxesYearly / 12 +
    (inputs.hoa ?? 0) +
    (inputs.pmi ?? 0) +
    (inputs.otherMonthlyExpenses ?? 0);

  return {
    type: "mortgage",
    monthlyPayment: Math.round(monthlyMortgage * 100) / 100,
    principalAndInterest: Math.round(monthlyMortgage * 100) / 100,
    totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
  };
}
