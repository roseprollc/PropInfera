import type { AirbnbInputs, AirbnbAnalysisResults, MonthlyBreakdown, RentalInputs } from "@/types/analysis";
import { calculateLoanAmount, calculateMonthlyMortgage, calculateAnnualPrincipalPayment } from "../mortgage/amortization";
import {
  calculateNOI,
  calculateCapRate,
  calculateCashOnCash,
  calculateROI,
  calculateBreakEvenOccupancy,
} from "./metrics";
import { generateAirbnbProjection } from "./projection";

export function calculateAirbnbMetrics(inputs: AirbnbInputs): AirbnbAnalysisResults {
  const loanInputs: RentalInputs = {
    ...inputs,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: inputs.annualAppreciationPercent || 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: inputs.holdingPeriodYears || 0
  };

  const loanAmount = calculateLoanAmount(loanInputs);
  const monthlyMortgage = calculateMonthlyMortgage(loanInputs, loanAmount);
  const monthlyInterestRate = inputs.interestRate / 100 / 12;

  const projectedAnnualIncome = inputs.averageNightlyRate * (inputs.occupancyRatePercent / 100) * 365;
  const monthlyAirbnbIncome = projectedAnnualIncome / 12;

  const noi = calculateNOI(inputs);

  const annualCashFlow = noi - (monthlyMortgage * 12);
  const totalOperatingExpenses = projectedAnnualIncome - noi;

  const downPayment = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
  const closingCosts = inputs.purchasePrice * (inputs.closingCostsPercent / 100);
  const totalCashInvestment = downPayment + closingCosts;

  const capRate = calculateCapRate(noi, inputs.purchasePrice);
  const cashOnCash = calculateCashOnCash(annualCashFlow, totalCashInvestment);

  const annualAppreciation = inputs.purchasePrice * ((inputs.annualAppreciationPercent || 0) / 100);
  const annualPrincipalPaydown = calculateAnnualPrincipalPayment(loanAmount, monthlyInterestRate, 1, monthlyMortgage);

  const roi = calculateROI(
    annualCashFlow,
    annualAppreciation,
    annualPrincipalPaydown,
    totalCashInvestment
  );

  const breakEvenOccupancy = calculateBreakEvenOccupancy(
    totalOperatingExpenses / 12,
    monthlyMortgage,
    projectedAnnualIncome
  );

  const projection = generateAirbnbProjection(inputs, monthlyMortgage);
  const monthlyBreakdown: MonthlyBreakdown[] = projection.map((year, index) => ({
    month: new Date(0, index).toLocaleString('default', { month: 'short' }),
    income: Math.round(year.annualRent / 12),
    expenses: Math.round(year.annualExpenses / 12),
    cashFlow: Math.round(year.annualCashFlow / 12),
    occupancyRate: inputs.occupancyRatePercent,
  }));

  return {
    type: "airbnb",
    monthlyAirbnbIncome: Math.round(monthlyAirbnbIncome * 100) / 100,
    annualCashFlow: Math.round(annualCashFlow),
    roi: Math.round(roi * 100) / 100,
    netOperatingIncome: Math.round(noi),
    totalOperatingExpenses: Math.round(totalOperatingExpenses),
    monthlyMortgagePayment: Math.round(monthlyMortgage * 100) / 100,
    totalCashInvestment: Math.round(totalCashInvestment),
    breakEvenOccupancy: Math.round(breakEvenOccupancy * 100) / 100,
    averageDailyRate: Math.round(inputs.averageNightlyRate * 100) / 100,
    projectedAnnualIncome: Math.round(projectedAnnualIncome),
    monthlyBreakdown,
  };
}
