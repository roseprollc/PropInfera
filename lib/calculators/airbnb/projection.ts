import type { AirbnbInputs, ProjectionYear } from '@/types/analysis';

export function generateAirbnbProjection(inputs: AirbnbInputs, monthlyMortgage: number): ProjectionYear[] {
  const {
    averageNightlyRate,
    occupancyRatePercent,
    annualAppreciationPercent = 0,
    holdingPeriodYears = 5,
    purchasePrice,
    insuranceCostMonthly,
    utilitiesMonthlyCost,
    propertyTaxesYearly,
    hoa = 0,
    propertyManagementPercent = 0,
    maintenancePercent = 0,
    cleaningFeePerStay = 0,
    averageStayDurationNights = 1,
  } = inputs;

  const projection: ProjectionYear[] = [];

  let currentValue = purchasePrice;
  const currentNightlyRate = averageNightlyRate;

  for (let year = 1; year <= holdingPeriodYears; year++) {
    const annualIncome = currentNightlyRate * (occupancyRatePercent / 100) * 365;

    const annualCleaningFees = cleaningFeePerStay * (365 / averageStayDurationNights);

    const operatingExpenses =
      propertyTaxesYearly +
      insuranceCostMonthly * 12 +
      utilitiesMonthlyCost * 12 +
      hoa * 12 +
      (annualIncome * (propertyManagementPercent / 100)) +
      (annualIncome * (maintenancePercent / 100)) +
      annualCleaningFees;

    const annualMortgage = monthlyMortgage * 12;
    const annualCashFlow = annualIncome - operatingExpenses - annualMortgage;
    const appreciation = currentValue * (annualAppreciationPercent / 100);
    const equityGrowth = appreciation;
    const totalReturn = equityGrowth + annualCashFlow;

    projection.push({
      year,
      propertyValue: Math.round(currentValue),
      annualRent: Math.round(annualIncome),
      annualExpenses: Math.round(operatingExpenses),
      annualMortgage: Math.round(annualMortgage),
      annualCashFlow: Math.round(annualCashFlow),
      equityGrowth: Math.round(equityGrowth),
      totalReturn: Math.round(totalReturn),
    });

    currentValue *= 1 + (annualAppreciationPercent / 100);
  }

  return projection;
}
