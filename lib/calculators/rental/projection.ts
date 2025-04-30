import type { RentalInputs, ProjectionYear } from '@/types/analysis';
import { EXPENSE_GROWTH } from '../core/constants';
import { calculateLoanAmount } from '../mortgage/amortization';
import { calculateAnnualPrincipalPayment } from '../mortgage/amortization';

export function generateProjection(
  inputs: RentalInputs,
  monthlyMortgage: number
): ProjectionYear[] {
  const projection: ProjectionYear[] = [];
  
  const loanAmount = calculateLoanAmount(inputs);
  const monthlyInterestRate = inputs.interestRate / 100 / 12;

  let propertyValue = inputs.purchasePrice;
  let yearlyRent = inputs.monthlyRent * 12;

  const annualMortgage = monthlyMortgage * 12;

  for (let year = 1; year <= inputs.holdingPeriodYears; year++) {
    if (year > 1) {
      propertyValue *= 1 + inputs.annualAppreciationPercent / 100;
      yearlyRent *= 1 + inputs.annualRentIncreasePercent / 100;
    }

    const effectiveGrossIncome = yearlyRent * (1 - inputs.vacancyRatePercent / 100);
    
    const propertyTaxes = inputs.propertyTaxesYearly * 
      Math.pow(1 + EXPENSE_GROWTH.PROPERTY_TAX, year - 1);
    
    const insurance = inputs.insuranceCostMonthly * 12 * 
      Math.pow(1 + EXPENSE_GROWTH.INSURANCE, year - 1);
    
    const utilities = inputs.utilitiesMonthlyCost * 12 * 
      Math.pow(1 + EXPENSE_GROWTH.UTILITIES, year - 1);
    
    const propertyManagement = (effectiveGrossIncome * inputs.propertyManagementPercent) / 100;
    const maintenance = (effectiveGrossIncome * inputs.maintenancePercent) / 100;
    const capExReserve = (effectiveGrossIncome * inputs.capExReservePercent) / 100;
    const hoa = (inputs.hoa || 0) * 12;
    
    const operatingExpenses =
      propertyManagement +
      maintenance +
      propertyTaxes +
      insurance +
      utilities +
      hoa +
      capExReserve;

    const annualCashFlow = effectiveGrossIncome - operatingExpenses - annualMortgage;

    const equityGrowthFromAppreciation = propertyValue * (inputs.annualAppreciationPercent / 100);
    
    const principalPaydown = calculateAnnualPrincipalPayment(
      loanAmount,
      monthlyInterestRate,
      monthlyMortgage,
      year
    );
    
    const totalEquityGrowth = equityGrowthFromAppreciation + principalPaydown;

    projection.push({
      year,
      propertyValue: Math.round(propertyValue),
      annualRent: Math.round(yearlyRent),
      annualExpenses: Math.round(operatingExpenses),
      annualMortgage: Math.round(annualMortgage),
      annualCashFlow: Math.round(annualCashFlow),
      equityGrowth: Math.round(totalEquityGrowth),
      totalReturn: Math.round(annualCashFlow + totalEquityGrowth)
    });
  }

  return projection;
}