import { ObjectId } from 'mongodb';

/**
 * Type representing all possible calculator types in the application
 */
export type CalculatorType = 'rental' | 'airbnb' | 'wholesale' | 'mortgage' | 'renters';

/**
 * Base interface for all calculator inputs
 */
export interface BaseCalculatorInputs {
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
}

/**
 * Type-specific calculator inputs
 */
export interface RentalInputs extends BaseCalculatorInputs {
  monthlyRent: number;
  vacancyRatePercent: number;
  capExReservePercent: number;
  annualAppreciationPercent: number;
  annualRentIncreasePercent: number;
  holdingPeriodYears: number;
}

export interface AirbnbInputs extends BaseCalculatorInputs {
  nightlyRate: number;
  occupancyRate: number;
  cleaningFee: number;
  platformFeesPercent: number;
}

export interface WholesaleInputs extends BaseCalculatorInputs {
  afterRepairValue: number;
  repairCosts: number;
  assignmentFee: number;
  miscHoldingCosts: number;
}

export interface MortgageInputs extends BaseCalculatorInputs {
  hoaFees: number;
}

export interface RentersInputs extends BaseCalculatorInputs {
  securityDeposit: number;
  leaseTerm: number;
  utilitiesIncluded: boolean;
}

/**
 * Union type of all calculator inputs
 */
export type CalculatorInputs = 
  | RentalInputs 
  | AirbnbInputs 
  | WholesaleInputs 
  | MortgageInputs 
  | RentersInputs;

/**
 * Analysis results for each calculator type
 */
export interface RentalAnalysisResults {
  type: 'rental';
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
  type: 'airbnb';
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
  type: 'wholesale';
  assignmentFee: number;
  roi: number;
  profit: number;
  totalInvestment: number;
  holdingCosts: number;
  netProfit: number;
  returnOnInvestment: number;
}

export interface MortgageAnalysisResults {
  type: 'mortgage';
  monthlyPayment: number;
  principalAndInterest: number;
  totalMonthlyPayment: number;
}

export interface RentersAnalysisResults {
  type: 'renters';
  monthlyCashFlow: number;
  annualCashFlow: number;
  monthlyRevenue: number;
}

/**
 * Monthly breakdown for Airbnb analysis
 */
export interface MonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
  cashFlow: number;
  occupancyRate: number;
}

/**
 * Projection data for future years
 */
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

/**
 * Union type of all analysis results
 */
export type AnalysisResults = 
  | RentalAnalysisResults
  | AirbnbAnalysisResults
  | WholesaleAnalysisResults
  | MortgageAnalysisResults
  | RentersAnalysisResults;

/**
 * Type guard functions for each calculator type
 */
export function isRentalResults(results: AnalysisResults): results is RentalAnalysisResults {
  return results.type === 'rental';
}

export function isAirbnbResults(results: AnalysisResults): results is AirbnbAnalysisResults {
  return results.type === 'airbnb';
}

export function isWholesaleResults(results: AnalysisResults): results is WholesaleAnalysisResults {
  return results.type === 'wholesale';
}

export function isMortgageResults(results: AnalysisResults): results is MortgageAnalysisResults {
  return results.type === 'mortgage';
}

export function isRentersResults(results: AnalysisResults): results is RentersAnalysisResults {
  return results.type === 'renters';
}

/**
 * Generic analysis state interface
 */
export interface AnalysisState<T extends CalculatorType> {
  currentAnalysis: Analysis<T> | null;
  calculatorInputs: CalculatorInputs;
  results: AnalysisResults | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Action types for the calculator reducer
 */
export type AnalysisAction =
  | { type: 'SET_INPUTS'; payload: { type: CalculatorType; inputs: CalculatorInputs } }
  | { type: 'SET_RESULTS'; payload: AnalysisResults }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CALCULATOR' };

/**
 * Generic analysis interface
 */
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