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
    purchasePrice: inputs.purchasePrice,
    downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
    loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTermYears,
    propertyTaxes: inputs.propertyTaxesYearly / 12,
    insurance: inputs.insuranceCostMonthly,
    pmi: inputs.pmi ?? 0,
    hoaFees: inputs.hoa ?? 0,
    monthlyMortgage: monthlyMortgage,
    totalMonthlyPayment: totalMonthlyPayment,
    interest: (loanAmount * inputs.interestRate) / 100,
    totalPaid: totalMonthlyPayment * (inputs.loanTermYears * 12),
    monthlyPayment: monthlyMortgage,
    principalAndInterest: monthlyMortgage
  };
}

export function calculateMortgage(inputs: MortgageInputs): MortgageAnalysisResults {
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

  const interest = (loanAmount * inputs.interestRate) / 100;
  const totalPaid = totalMonthlyPayment * (inputs.loanTermYears * 12);

  return {
    type: 'mortgage',
    purchasePrice: inputs.purchasePrice,
    downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
    loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTermYears,
    propertyTaxes: inputs.propertyTaxesYearly / 12,
    insurance: inputs.insuranceCostMonthly,
    pmi: inputs.pmi ?? 0,
    hoaFees: inputs.hoa ?? 0,
    monthlyMortgage: monthlyMortgage,
    totalMonthlyPayment: totalMonthlyPayment,
    interest: interest,
    totalPaid: totalPaid,
    monthlyPayment: monthlyMortgage,
    principalAndInterest: monthlyMortgage
  };
}
