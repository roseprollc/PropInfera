// Property Analysis Types
export interface PropertyAnalysis {
  id: string;
  address: string;
  analysis: RentalAnalysisResults;
  inputs: CalculatorInputs;
}

// Calculator Input Types
export interface CalculatorInputs {
  propertyAddress: string;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  monthlyRent: number;
  vacancyRatePercent: number;
  propertyManagementPercent: number;
  maintenancePercent: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  utilitiesMonthly: number;
  capExReservePercent: number;
  annualAppreciationPercent: number;
  annualRentIncreasePercent: number;
  holdingPeriodYears: number;
  incomeTaxRate: number;
}

// Analysis Results Types
export interface RentalAnalysisResults {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number;
  capRate: number;
  netOperatingIncome: number;
  totalOperatingExpenses: number;
  monthlyMortgagePayment: number;
  totalCashInvestment: number;
  breakEvenOccupancy: number;
  irr: number;
  fiveYearProjection: ProjectionYear[];
  roi: number;
  grossRentMultiplier: number;
  debtServiceCoverageRatio: number;
}

// Projection Types
export interface ProjectionYear {
  year: number;
  propertyValue: number;
  annualRent: number;
  annualExpenses: number;
  annualMortgage: number;
  annualCashFlow: number;
  equityGrowth: number;
  totalReturn: number;
}

// State Management Types
export interface AnalysisState {
  properties: PropertyAnalysis[];
  currentProperty: PropertyAnalysis | null;
  calculatorInputs: CalculatorInputs;
  isLoading: boolean;
  error: string | null;
}

// Action Types for Reducer
export type AnalysisAction =
  | { type: 'SET_PROPERTIES'; payload: PropertyAnalysis[] }
  | { type: 'SET_CURRENT_PROPERTY'; payload: PropertyAnalysis | null }
  | { type: 'UPDATE_CALCULATOR_INPUTS'; payload: Partial<CalculatorInputs> }
  | { type: 'SET_ANALYSIS_RESULT'; payload: PropertyAnalysis }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CALCULATOR' }; 