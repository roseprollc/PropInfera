export interface CalculatorInput {
  propertyAddress: string;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  utilitiesMonthly: number;
  maintenancePercent: number;
  propertyManagementPercent: number;
  monthlyRent: number;
  vacancyRatePercent: number;
  capExReservePercent: number;
  annualAppreciationPercent: number;
  annualRentIncreasePercent: number;
  holdingPeriodYears: number;
  nightlyRate?: number;
  occupancyRate?: number;
  cleaningFee?: number;
  platformFeesPercent?: number;
}

export interface CalculatorResults {
  monthlyMortgagePayment: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  monthlyOperatingExpenses?: number;
  monthlyRevenue?: number;
  fiveYearProjection?: Array<{
    year: number;
    propertyValue: number;
    annualRent: number;
    annualExpenses: number;
    annualMortgage: number;
    annualCashFlow: number;
    equityGrowth: number;
    totalReturn: number;
  }>;
}

export type CalculatorType = 'airbnb' | 'rental' | 'flip'; 