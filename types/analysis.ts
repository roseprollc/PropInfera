import { ObjectId } from 'mongodb';

export type CalculatorType = 'rental' | 'airbnb' | 'wholesale' | 'mortgage' | 'renters';

// Property Analysis Types
export interface PropertyAnalysis {
  id: string;
  address: string;
  analysis: RentalAnalysisResults | AirbnbAnalysisResults | WholesaleAnalysisResults | MortgageAnalysisResults | RentersAnalysisResults;
  inputs: CalculatorInputs;
  analysisType: 'RENTAL' | 'AIRBNB' | 'WHOLESALE' | 'MORTGAGE' | 'RENTERS';
}

// Calculator Input Types
export interface CalculatorInputs {
  // Common fields
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
  
  // Rental specific fields
  monthlyRent?: number;
  vacancyRatePercent?: number;
  capExReservePercent?: number;
  annualAppreciationPercent?: number;
  annualRentIncreasePercent?: number;
  holdingPeriodYears?: number;
  
  // Airbnb specific fields
  nightlyRate?: number;
  occupancyRate?: number;
  cleaningFee?: number;
  platformFeesPercent?: number;
  
  // Wholesale specific fields
  afterRepairValue?: number;
  repairCosts?: number;
  assignmentFee?: number;
  miscHoldingCosts?: number;

  // Mortgage specific fields
  hoaFees?: number;

  // Renters specific fields
  securityDeposit?: number;
  leaseTerm?: number;
  utilitiesIncluded?: boolean;
}

// Analysis Results Types
export interface RentalAnalysisResults {
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCash: number;
  roi: number;
  totalCashInvestment: number;
  netOperatingIncome: number;
  totalOperatingExpenses: number;
  monthlyMortgagePayment: number;
  breakEvenOccupancy: number;
  irr: number;
  grossRentMultiplier: number;
  debtServiceCoverageRatio: number;
}

export interface AirbnbAnalysisResults {
  monthlyAirbnbIncome: number;
  annualCashFlow: number;
  roi: number;
  netOperatingIncome: number;
  totalOperatingExpenses: number;
  monthlyMortgagePayment: number;
  totalCashInvestment: number;
  breakEvenOccupancy: number;
  averageDailyRate: number;
  projectedAnnualIncome: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface WholesaleAnalysisResults {
  assignmentFee: number;
  roi: number;
  profit: number;
  totalInvestment: number;
  holdingCosts: number;
  netProfit: number;
  returnOnInvestment: number;
}

export interface MortgageAnalysisResults {
  monthlyPayment: number;
  principalAndInterest: number;
  totalMonthlyPayment: number;
}

export interface RentersAnalysisResults {
  monthlyCashFlow: number;
  annualCashFlow: number;
  monthlyRevenue: number;
}

export interface MonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
  cashFlow: number;
  occupancyRate: number;
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

// Discriminated Union for Analysis Results
export type AnalysisResults = 
  | { type: 'rental'; data: RentalAnalysisResults }
  | { type: 'airbnb'; data: AirbnbAnalysisResults }
  | { type: 'wholesale'; data: WholesaleAnalysisResults }
  | { type: 'mortgage'; data: MortgageAnalysisResults }
  | { type: 'renters'; data: RentersAnalysisResults };

// Generic Analysis State
export interface AnalysisState<T extends CalculatorType> {
  currentAnalysis: Analysis<T> | null;
  calculatorInputs: CalculatorInputs;
  results: AnalysisResults | null;
  isLoading: boolean;
  error: string | null;
}

// Action Types for Reducer
export type AnalysisAction =
  | { type: 'SET_INPUT'; field: keyof CalculatorInputs; value: number | string }
  | { type: 'SET_RESULTS'; results: AnalysisResults }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CALCULATOR' };

// Generic Analysis Type
export interface Analysis<T extends CalculatorType> {
  id: string;
  userId: string;
  type: T;
  title: string;
  propertyName: string;
  propertyAddress: string;
  inputs: CalculatorInputs;
  results: AnalysisResults;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 