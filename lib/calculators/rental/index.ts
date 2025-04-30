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

export function calculateRentalMetrics(inputs: RentalInputs): RentalAnalysisResults {
  const calculationInputs = { ...inputs };

  const loanAmount = calculateLoanAmount(calculationInputs);
  const monthlyMortgage = calculateMonthlyMortgage(calculationInputs, loanAmount);
  const monthlyInterestRate = calculationInputs.interestRate / 100 / 12;

  const noi = calculateNOI(calculationInputs);
  const capRate = calculateCapRate(noi, calculationInputs.purchasePrice);

  const annualMortgage = monthlyMortgage * 12;
  const annualCashFlow = noi - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;

  const downPayment = (calculationInputs.purchasePrice * calculationInputs.downPaymentPercent) / 100;
  const closingCosts = (calculationInputs.closingCostsPercent / 100) * calculationInputs.purchasePrice;
  const totalCashInvestment = downPayment + closingCosts;

  const cashOnCash = calculateCashOnCash(annualCashFlow, totalCashInvestment);

  const projection = generateProjection(calculationInputs, monthlyMortgage);
  const cashFlows = projection.map((year) => year.annualCashFlow);
  const finalValue = projection.at(-1)?.propertyValue ?? 0;

  const irr = calculateIRR(totalCashInvestment, cashFlows, finalValue);
  const grm = calculateGRM(calculationInputs.purchasePrice, calculationInputs.monthlyRent * 12);
  const dscr = calculateDSCR(noi, annualMortgage);
  const breakEvenOccupancy = calculateBreakEvenOccupancy(
    noi + annualMortgage,
    annualMortgage,
    calculationInputs.monthlyRent * 12
  );

  const annualAppreciation =
    calculationInputs.purchasePrice * (calculationInputs.annualAppreciationPercent / 100);
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
    monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
    annualCashFlow: Math.round(annualCashFlow),
    cashOnCash: Math.round(cashOnCash * 100) / 100,
    capRate: Math.round(capRate * 100) / 100,
    netOperatingIncome: Math.round(noi),
    totalOperatingExpenses: Math.round(noi + annualMortgage - annualCashFlow),
    monthlyMortgagePayment: Math.round(monthlyMortgage * 100) / 100,
    totalCashInvestment: Math.round(totalCashInvestment),
    breakEvenOccupancy: Math.round(breakEvenOccupancy * 100) / 100,
    irr: Math.round(irr * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    grossRentMultiplier: Math.round(grm * 100) / 100,
    debtServiceCoverageRatio: Math.round(dscr * 100) / 100,
    monthlyRevenue: Math.round(calculationInputs.monthlyRent * 100) / 100
  };
}

// Re-export utilities
export * from './metrics';
export * from './projection';
