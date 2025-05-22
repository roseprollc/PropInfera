import type { RentalInputs, RentalAnalysisResults } from '@/types/analysis';
import {
  calculateLoanAmount,
  calculateMonthlyMortgage,
  calculateAnnualPrincipalPayment,
} from '../mortgage/amortization';
import {
  calculateNOI,
  calculateCapRate,
  calculateCashOnCash,
  calculateROI,
  calculateGRM,
  calculateDSCR,
  calculateBreakEvenOccupancy,
} from './metrics';
import { generateProjection } from './projection';
import { calculateIRR } from '../investment/irr';

export function calculateRental(inputs: RentalInputs): RentalAnalysisResults {
  const loanAmount = calculateLoanAmount(inputs);
  const monthlyMortgage = calculateMonthlyMortgage(inputs, loanAmount);
  const monthlyInterestRate = inputs.interestRate / 100 / 12;

  const noi = calculateNOI(inputs);
  const capRate = calculateCapRate(noi, inputs.purchasePrice);

  const annualMortgage = monthlyMortgage * 12;
  const annualCashFlow = noi - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;

  const downPayment = (inputs.purchasePrice * inputs.downPaymentPercent) / 100;
  const closingCosts = (inputs.closingCostsPercent / 100) * inputs.purchasePrice;
  const totalCashInvestment = downPayment + closingCosts;

  const cashOnCash = calculateCashOnCash(annualCashFlow, totalCashInvestment);

  const projection = generateProjection(inputs, monthlyMortgage);
  const cashFlows = projection.map((year) => year.annualCashFlow);
  const finalValue = projection.at(-1)?.propertyValue ?? 0;

  const irr = calculateIRR(totalCashInvestment, cashFlows, finalValue);
  const grm = calculateGRM(inputs.purchasePrice, inputs.monthlyRent * 12);
  const dscr = calculateDSCR(noi, annualMortgage);
  const breakEvenOccupancy = calculateBreakEvenOccupancy(
    noi + annualMortgage,
    annualMortgage,
    inputs.monthlyRent * 12
  );

  const annualAppreciation =
    inputs.purchasePrice * (inputs.annualAppreciationPercent / 100);
  const annualPrincipalPaydown = calculateAnnualPrincipalPayment(
    loanAmount,
    monthlyInterestRate,
    1,
    monthlyMortgage
  );

  const roi = calculateROI(
    annualCashFlow,
    annualAppreciation,
    annualPrincipalPaydown,
    totalCashInvestment
  );

  return {
    type: 'rental',
    purchasePrice: inputs.purchasePrice,
    downPayment: inputs.purchasePrice * (inputs.downPaymentPercent / 100),
    loanAmount: inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100),
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTermYears,
    monthlyRent: inputs.monthlyRent,
    vacancyRate: inputs.vacancyRatePercent,
    propertyTaxes: inputs.propertyTaxesYearly / 12,
    insurance: inputs.insuranceCostMonthly,
    hoaFees: inputs.hoa ?? 0,
    maintenance: inputs.purchasePrice * (inputs.maintenancePercent / 100) / 12,
    managementFees: inputs.monthlyRent * (inputs.propertyManagementPercent / 100),
    utilities: inputs.utilitiesMonthlyCost,
    otherExpenses: 0,
    monthlyMortgage: monthlyMortgage,
    totalMonthlyExpenses: monthlyMortgage + inputs.monthlyRent * (inputs.propertyManagementPercent / 100) + inputs.insuranceCostMonthly + inputs.propertyTaxesYearly / 12 + (inputs.hoa ?? 0) + (inputs.maintenancePercent / 100) * inputs.purchasePrice / 12,
    netOperatingIncome: noi,
    cashFlow: monthlyCashFlow,
    capRate: capRate,
    roi: roi,
    breakEvenOccupancy: breakEvenOccupancy,
    cashOnCashReturn: cashOnCash,
    grossRentMultiplier: grm,
    debtServiceCoverageRatio: dscr,
    monthlyCashFlow: monthlyCashFlow,
    annualCashFlow: annualCashFlow
  };
}

// Re-export utilities
export * from './metrics';
export * from './projection';
