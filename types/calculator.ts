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
  nightlyRate: number;
  occupancyRate: number;
  cleaningFee: number;
  platformFeesPercent: number;
  monthlyRent: number;
  vacancyRatePercent: number;
  capExReservePercent: number;
}

export interface CalculatorResults {
  monthlyMortgagePayment: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
}

export type CalculatorType = 'airbnb' | 'rental' | 'flip'; 