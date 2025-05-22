import { calculateLoanAmount, calculateMonthlyMortgage, calculateAnnualPrincipalPayment } from '../mortgage/amortization';
import { calculateNOI, calculateROI, calculateBreakEvenOccupancy } from './metrics';
import type { AirbnbInputs, AirbnbAnalysisResults, MonthlyBreakdown } from '@/types/analysis';
import { generateAirbnbProjection } from "./projection";

export function calculateAirbnb(inputs: AirbnbInputs): AirbnbAnalysisResults {
  const loanAmount = calculateLoanAmount({
    ...inputs,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: inputs.holdingPeriodYears || 0
  });

  const monthlyMortgage = calculateMonthlyMortgage({
    ...inputs,
    monthlyRent: 0,
    vacancyRatePercent: 0,
    capExReservePercent: 0,
    annualAppreciationPercent: 0,
    annualRentIncreasePercent: 0,
    holdingPeriodYears: inputs.holdingPeriodYears || 0
  }, loanAmount);

  const monthlyInterestRate = inputs.interestRate / 100 / 12;

  const projectedAnnualIncome = inputs.averageNightlyRate * (inputs.occupancyRatePercent / 100) * 365;
  const monthlyAirbnbIncome = projectedAnnualIncome / 12;

  const noi = calculateNOI(inputs);

  const annualCashFlow = noi - (monthlyMortgage * 12);
  const totalOperatingExpenses = projectedAnnualIncome - noi;

  const downPayment = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
  const closingCosts = inputs.purchasePrice * (inputs.closingCostsPercent / 100);
  const totalCashInvestment = downPayment + closingCosts;

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
    type: 'airbnb',
    purchasePrice: inputs.purchasePrice,
    downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
    loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTermYears,
    nightlyRate: inputs.averageNightlyRate,
    occupancyRate: inputs.occupancyRatePercent,
    cleaningFees: inputs.cleaningFeePerStay,
    propertyTaxes: inputs.propertyTaxesYearly / 12,
    insurance: inputs.insuranceCostMonthly,
    hoaFees: inputs.hoa ?? 0,
    maintenance: inputs.purchasePrice * (inputs.maintenancePercent / 100) / 12,
    managementFees: inputs.averageNightlyRate * (inputs.propertyManagementPercent / 100),
    utilities: inputs.utilitiesMonthlyCost,
    otherExpenses: 0,
    monthlyMortgage: monthlyMortgage,
    totalOperatingExpenses: totalOperatingExpenses,
    grossRevenue: projectedAnnualIncome,
    netProfit: annualCashFlow,
    annualCashFlow: annualCashFlow,
    monthlyAirbnbIncome: monthlyAirbnbIncome,
    seasonalVariation: 0,
    breakEvenOccupancy: breakEvenOccupancy,
    monthlyBreakdown: monthlyBreakdown,
    averageDailyRate: inputs.averageNightlyRate
  };
}
