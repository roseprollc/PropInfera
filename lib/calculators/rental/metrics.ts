import type { RentalInputs } from '@/types/analysis';

export function calculateNOI(inputs: RentalInputs): number {
  if (inputs.monthlyRent < 0) return 0;
  
  const annualRentalIncome = inputs.monthlyRent * 12;
  const vacancyLoss = (annualRentalIncome * inputs.vacancyRatePercent) / 100;
  const effectiveGrossIncome = annualRentalIncome - vacancyLoss;
  const propertyManagement = (effectiveGrossIncome * inputs.propertyManagementPercent) / 100;
  const maintenance = (effectiveGrossIncome * inputs.maintenancePercent) / 100;
  const capExReserve = (effectiveGrossIncome * inputs.capExReservePercent) / 100;
  const utilities = inputs.utilitiesMonthlyCost * 12;
  const totalOperatingExpenses =
    propertyManagement +
    maintenance +
    inputs.propertyTaxesYearly +
    inputs.insuranceCostMonthly * 12 +
    utilities +
    capExReserve +
    (inputs.hoa || 0) * 12;
  
  return effectiveGrossIncome - totalOperatingExpenses;
}

export function calculateCapRate(noi: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  return (noi / purchasePrice) * 100;
}

export function calculateCashOnCash(annualCashFlow: number, totalInvestment: number): number {
  if (totalInvestment <= 0) return 0;
  return (annualCashFlow / totalInvestment) * 100;
}

export function calculateROI(
  annualCashFlow: number,
  appreciationValue: number,
  principalPaydown: number,
  totalInvestment: number
): number {
  if (totalInvestment <= 0) return 0;
  const totalReturn = annualCashFlow + appreciationValue + principalPaydown;
  return (totalReturn / totalInvestment) * 100;
}

export function calculateGRM(purchasePrice: number, annualRent: number): number {
  if (annualRent <= 0) return 0;
  return purchasePrice / annualRent;
}

export function calculateDSCR(noi: number, annualDebtService: number): number {
  if (annualDebtService <= 0) return 0;
  return noi / annualDebtService;
}

export function calculateBreakEvenOccupancy(
  operatingExpenses: number,
  annualMortgage: number,
  annualRent: number
): number {
  if (annualRent <= 0) return 100;
  const totalExpenses = operatingExpenses + annualMortgage;
  return Math.min((totalExpenses / annualRent) * 100, 100);
}