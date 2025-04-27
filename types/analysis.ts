import { ObjectId } from 'mongodb';

/**
 * Type representing all possible calculator types in the application
 */
export type CalculatorType = 'mortgage' | 'rental' | 'airbnb' | 'wholesale';

/**
 * Type mapping for calculator inputs
 */
export interface CalculatorInputs {
  mortgage?: MortgageInputs;
  rental?: RentalInputs;
  airbnb?: AirbnbInputs;
  wholesale?: WholesaleInputs;
}

/**
 * Type mapping for analysis results
 */
export interface AnalysisResultsMap {
  mortgage: {
    loanAmount: number;
    downPayment: number;
    monthlyMortgagePayment: number;
    monthlyExpenses: number;
    totalMonthlyPayment: number;
  };
  airbnb: {
    loanAmount: number;
    downPayment: number;
    monthlyMortgagePayment: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyCashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    roi: number;
    breakEvenOccupancy: number;
  };
  wholesale: {
    maxOfferAmount: number;
    potentialProfit: number;
    repairCostEstimate: number;
    afterRepairValue: number;
    assignmentFee: number;
  };
  renters: {
    loanAmount: number;
    downPayment: number;
    monthlyMortgagePayment: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    capRate: number;
    cashOnCashReturn: number;
    roi: number;
  };
  rental: {
    fiveYearProjection?: Array<{
      year: number;
      propertyValue: number;
      yearlyRent: number;
      operatingExpenses: number;
      annualCashFlow: number;
      totalAppreciation: number;
      roi: number;
    }>;
  };
}

/**
 * Base interface for all calculator inputs
 */
export interface BaseCalculatorInputs {
  propertyAddress?: string;
  purchasePrice: number;
  closingCostsPercent: number;
  propertyManagementPercent: number;
  maintenancePercent: number;
  insuranceCostMonthly: number;
  propertyTaxesYearly: number;
  utilitiesMonthlyCost: number;
  hoa?: number;
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
  averageNightlyRate: number;
  occupancyRatePercent: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  cleaningFeePerStay: number;
  averageStayDurationNights: number;
  annualAppreciationPercent?: number;
  holdingPeriodYears?: number;
}

export interface WholesaleInputs extends BaseCalculatorInputs {
  estimatedRepairCost: number;
  arv: number;
  assignmentFee: number;
  maxOfferPercent: number;
}

export interface MortgageInputs extends BaseCalculatorInputs {
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  pmi?: number;
  otherMonthlyExpenses?: number;
}

export interface RentersInputs extends BaseCalculatorInputs {
  monthlyRent?: number;
  vacancyRatePercent?: number;
  capExReservePercent?: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  annualAppreciationPercent?: number;
  annualRentIncreasePercent?: number;
  holdingPeriodYears?: number;
}

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
export type AnalysisResults = AnalysisResultsMap[keyof AnalysisResultsMap];

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
  calculatorInputs: CalculatorInputsMap[T];
  results: AnalysisResultsMap[T] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Action types for the calculator reducer
 */
export type AnalysisAction<T extends CalculatorType> =
  | { type: 'SET_INPUTS'; payload: { type: T; inputs: CalculatorInputsMap[T] } }
  | { type: 'SET_RESULTS'; payload: AnalysisResultsMap[T] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CALCULATOR' };

/**
 * Generic analysis interface
 */
export interface Analysis<T extends keyof AnalysisResultsMap> {
  _id?: string;
  type: T;
  data: AnalysisResultsMap[T];
  title: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Type guards for each calculator type
export function isRentalAnalysis(analysis: Analysis<AnalysisResults>): analysis is Analysis<RentalAnalysisResults> {
  return analysis.type === 'rental';
}

export function isAirbnbAnalysis(analysis: Analysis<AnalysisResults>): analysis is Analysis<AirbnbAnalysisResults> {
  return analysis.type === 'airbnb';
}

export function isWholesaleAnalysis(analysis: Analysis<AnalysisResults>): analysis is Analysis<WholesaleAnalysisResults> {
  return analysis.type === 'wholesale';
}

export function isMortgageAnalysis(analysis: Analysis<AnalysisResults>): analysis is Analysis<MortgageAnalysisResults> {
  return analysis.type === 'mortgage';
}

export function isRentersAnalysis(analysis: Analysis<AnalysisResults>): analysis is Analysis<RentersAnalysisResults> {
  return analysis.type === 'renters';
}

export type AnyAnalysis = Analysis<any>; 