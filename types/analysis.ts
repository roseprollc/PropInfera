import { ObjectId } from 'mongodb';

// Property Analysis Types
export interface PropertyAnalysis {
  id: string;
  address: string;
  analysis: RentalAnalysisResults | AirbnbAnalysisResults | WholesaleAnalysisResults;
  inputs: CalculatorInputs;
  analysisType: 'RENTAL' | 'AIRBNB' | 'WHOLESALE';
}

// Calculator Input Types
export interface CalculatorInputs {
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
  monthlyRent?: number;
  vacancyRatePercent?: number;
  capExReservePercent?: number;
  annualAppreciationPercent?: number;
  annualRentIncreasePercent?: number;
  holdingPeriodYears?: number;
  nightlyRate?: number;
  occupancyRate?: number;
  cleaningFee?: number;
  platformFeesPercent?: number;
  afterRepairValue?: number;
  repairCosts?: number;
  assignmentFee?: number;
  miscHoldingCosts?: number;
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

export type AnalysisType = 'rental' | 'airbnb' | 'wholesale' | 'mortgage';

export interface AnalysisResults {
  monthlyCashFlow?: number;
  annualCashFlow?: number;
  capRate?: number;
  cashOnCash?: number;
  roi?: number;
  totalCashInvestment?: number;
  netOperatingIncome?: number;
  totalOperatingExpenses?: number;
  monthlyMortgagePayment?: number;
  breakEvenOccupancy?: number;
  irr?: number;
  grossRentMultiplier?: number;
  debtServiceCoverageRatio?: number;
}

export interface Analysis {
  _id: string | ObjectId;
  userId: string;
  type: 'rental' | 'airbnb' | 'wholesale' | 'mortgage';
  propertyName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  inputs: Record<string, any>;
  results: Record<string, number>;
  insights?: string;
  insightsLastGeneratedAt?: string;
} 