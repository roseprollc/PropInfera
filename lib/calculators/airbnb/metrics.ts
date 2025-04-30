import type { AirbnbInputs } from '@/types/analysis';

export function calculateNOI(inputs: AirbnbInputs): number {
  const grossIncome =
    inputs.averageNightlyRate *
    (inputs.occupancyRatePercent / 100) *
    365;

  const annualCleaningFees =
    (inputs.cleaningFeePerStay || 0) *
    (365 / (inputs.averageStayDurationNights || 1));

  const expenses =
    inputs.propertyTaxesYearly +
    inputs.insuranceCostMonthly * 12 +
    inputs.utilitiesMonthlyCost * 12 +
    (inputs.hoa || 0) * 12 +
    (grossIncome * (inputs.maintenancePercent / 100)) +
    (grossIncome * (inputs.propertyManagementPercent / 100)) +
    annualCleaningFees;

  return grossIncome - expenses;
}

export function calculateCapRate(noi: number, purchasePrice: number): number {
  if (!purchasePrice) return 0;
  return (noi / purchasePrice) * 100;
}

export function calculateCashOnCash(annualCashFlow: number, totalCashInvestment: number): number {
  if (!totalCashInvestment) return 0;
  return (annualCashFlow / totalCashInvestment) * 100;
}

export function calculateROI(
  annualCashFlow: number,
  annualAppreciation: number,
  annualPrincipalPaydown: number,
  totalCashInvestment: number
): number {
  if (!totalCashInvestment) return 0;
  const totalAnnualReturn = annualCashFlow + annualAppreciation + annualPrincipalPaydown;
  return (totalAnnualReturn / totalCashInvestment) * 100;
}

export function calculateBreakEvenOccupancy(
  totalMonthlyExpenses: number,
  monthlyMortgage: number,
  projectedAnnualIncome: number
): number {
  if (!projectedAnnualIncome) return 100;
  const monthlyIncome = projectedAnnualIncome / 12;
  return ((totalMonthlyExpenses + monthlyMortgage) / monthlyIncome) * 100;
}
