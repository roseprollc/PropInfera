import { ObjectId } from 'mongodb';

/**
 * Type representing all possible calculator types in the application
 */
export type CalculatorType = 'rental' | 'airbnb' | 'wholesale' | 'mortgage' | 'renters';

/**
 * Type mapping for calculator inputs
 */
export interface CalculatorInputsMap {
  rental: {
    propertyAddress: string;
    purchasePrice: number;
    downPaymentPercent: number;
    loanTerm: number;
    interestRate: number;
    propertyTaxAnnual: number;
    insuranceAnnual: number;
    hoaFees: number;
    monthlyRent: number;
    vacancyRate: number;
    maintenanceRate: number;
    managementRate: number;
    capitalExpendituresRate: number;
  };
  airbnb: {
    propertyAddress: string;
    purchasePrice: number;
    downPaymentPercent: number;
    loanTerm: number;
    interestRate: number;
    propertyTaxAnnual: number;
    insuranceAnnual: number;
    hoaFees: number;
    nightlyRate: number;
    occupancyRate: number;
    cleaningFee: number;
    platformFeesPercent: number;
  };
  wholesale: {
    propertyAddress: string;
    purchasePrice: number;
    afterRepairValue: number;
    repairCosts: number;
    assignmentFee: number;
    closingCosts: number;
    miscHoldingCosts: number;
  };
  mortgage: {
    propertyAddress: string;
    purchasePrice: number;
    downPaymentPercent: number;
    loanTerm: number;
    interestRate: number;
    propertyTaxAnnual: number;
    insuranceAnnual: number;
    hoaFees: number;
  };
  renters: {
    monthlyRent: number;
    securityDeposit: number;
    leaseTerm: number;
    utilitiesIncluded: boolean;
  };
}

/**
 * Type mapping for analysis results
 */
export interface AnalysisResultsMap {
  rental: {
    type: 'rental';
    monthlyPayment: number;
    principalAndInterest: number;
    totalMonthlyPayment: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    cashOnCashReturn: number;
    capRate: number;
  };
  airbnb: {
    type: 'airbnb';
    monthlyPayment: number;
    principalAndInterest: number;
    totalMonthlyPayment: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    cashOnCashReturn: number;
    capRate: number;
  };
  wholesale: {
    type: 'wholesale';
    totalInvestment: number;
    profit: number;
    roi: number;
    holdingCosts: number;
    netProfit: number;
    returnOnInvestment: number;
    assignmentFee: number;
  };
  mortgage: {
    type: 'mortgage';
    monthlyPayment: number;
    principalAndInterest: number;
    totalMonthlyPayment: number;
  };
  renters: {
    type: 'renters';
    monthlyCashFlow: number;
    annualCashFlow: number;
    monthlyRevenue: number;
  };
}

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
export type Analysis<T extends AnalysisResults> = {
  _id?: string;
  type: T['type'];
  data: T;
  title: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

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