import type { ObjectId } from 'mongodb';

/**
 * Calculator types supported in the application
 */
export type CalculatorType = 'mortgage' | 'rental' | 'airbnb' | 'wholesale' | 'renters';

/**
 * Shared input fields across calculators
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
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
}

/**
 * Input types per calculator
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
  pmi?: number;
  otherMonthlyExpenses?: number;
}

export interface RentersInputs extends BaseCalculatorInputs {
  monthlyRent?: number;
  vacancyRatePercent?: number;
  capExReservePercent?: number;
  annualAppreciationPercent?: number;
  annualRentIncreasePercent?: number;
  holdingPeriodYears?: number;
}

/**
 * Composite type for state management
 */
export interface CalculatorInputs {
  mortgage?: MortgageInputs;
  rental?: RentalInputs;
  airbnb?: AirbnbInputs;
  wholesale?: WholesaleInputs;
  renters?: RentersInputs;
}

/**
 * Monthly breakdown for Airbnb
 */
export interface MonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
  cashFlow: number;
  occupancyRate: number;
}

/**
 * Rental 5-year projection
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
 * Results for each calculator
 */
export interface RentalAnalysisResults {
  type: 'rental';
  monthlyCashFlow: number;
  annualCashFlow: number;
  monthlyRevenue: number; // ✅ Added this to fix RentersCalculator error
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
 * Mapped types for result union
 */
export interface AnalysisResultsMap {
  mortgage: MortgageAnalysisResults;
  rental: RentalAnalysisResults;
  airbnb: AirbnbAnalysisResults;
  wholesale: WholesaleAnalysisResults;
  renters: RentersAnalysisResults;
}

export type AnalysisResults = AnalysisResultsMap[keyof AnalysisResultsMap];

/**
 * Type guards for analysis
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
 * Core analysis structure
 */
export interface Analysis<T extends CalculatorType = CalculatorType> {
  _id?: string | ObjectId;
  type: T;
  data: AnalysisResultsMap[T];
  title: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Creation & update types
 */
export type CreateAnalysisPayload<T extends CalculatorType> = Omit<
  Analysis<T>,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type UpdateAnalysisPayload<T extends CalculatorType> = Partial<
  Omit<Analysis<T>, '_id' | 'userId' | 'createdAt' | 'type'>
> & {
  _id: string | ObjectId;
};

export interface Report {
  _id?: string;
  email: string;
  propertyAddress: string;
  createdAt?: string;
  metrics: Record<string, any>;
}
