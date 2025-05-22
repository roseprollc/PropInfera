import { ObjectId } from 'mongodb';

/**
 * Calculator types supported in the application
 */
export type CalculatorType = 'rental' | 'airbnb' | 'wholesale' | 'mortgage' | 'renters';

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
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  vacancyRate: number;
  propertyTaxes: number;
  insurance: number;
  hoaFees: number;
  maintenance: number;
  managementFees: number;
  utilities: number;
  otherExpenses: number;
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;
  capRate: number;
  roi: number;
  breakEvenOccupancy: number;
  cashOnCashReturn: number;
  grossRentMultiplier: number;
  debtServiceCoverageRatio: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
}

export interface AirbnbAnalysisResults {
  type: 'airbnb';
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  nightlyRate: number;
  occupancyRate: number;
  cleaningFees: number;
  propertyTaxes: number;
  insurance: number;
  hoaFees: number;
  maintenance: number;
  managementFees: number;
  utilities: number;
  otherExpenses: number;
  monthlyMortgage: number;
  totalOperatingExpenses: number;
  grossRevenue: number;
  netProfit: number;
  annualCashFlow: number;
  monthlyAirbnbIncome: number;
  seasonalVariation: number;
  breakEvenOccupancy: number;
  monthlyBreakdown: MonthlyBreakdown[];
  averageDailyRate: number;
}

export interface WholesaleAnalysisResults {
  type: 'wholesale';
  purchasePrice: number;
  estimatedRepairCost: number;
  arv: number;
  assignmentFee: number;
  closingCosts: number;
  holdingCosts: number;
  marketingCosts: number;
  totalInvestment: number;
  profit: number;
  returnOnInvestment: number;
  profitMargin: number;
  roi: number;
  repairCosts: number;
}

export interface MortgageAnalysisResults {
  type: 'mortgage';
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxes: number;
  insurance: number;
  pmi: number;
  hoaFees: number;
  monthlyMortgage: number;
  totalMonthlyPayment: number;
  interest: number;
  totalPaid: number;
  monthlyPayment: number;
  principalAndInterest: number;
}

export interface RentersAnalysisResults {
  type: 'renters';
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  propertyTaxes: number;
  insurance: number;
  hoaFees: number;
  maintenance: number;
  managementFees: number;
  utilities: number;
  otherExpenses: number;
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  netOperatingIncome: number;
  cashFlow: number;
  capRate: number;
  roi: number;
  occupancyRate: number;
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

export type AnalysisResults =
  | RentalAnalysisResults
  | AirbnbAnalysisResults
  | WholesaleAnalysisResults
  | MortgageAnalysisResults
  | RentersAnalysisResults;

/**
 * Type guards for analysis
 */
export function isRentalResults(data: AnalysisResults): data is RentalAnalysisResults {
  return data.type === 'rental';
}

export function isAirbnbResults(data: AnalysisResults): data is AirbnbAnalysisResults {
  return data.type === 'airbnb';
}

export function isWholesaleResults(data: AnalysisResults): data is WholesaleAnalysisResults {
  return data.type === 'wholesale';
}

export function isMortgageResults(data: AnalysisResults): data is MortgageAnalysisResults {
  return data.type === 'mortgage';
}

export function isRentersResults(data: AnalysisResults): data is RentersAnalysisResults {
  return data.type === 'renters';
}

/**
 * Core analysis structure
 */
export interface Analysis<T extends CalculatorType = CalculatorType> {
  _id?: ObjectId | string;
  userId: string;
  type: T;
  data: T extends 'rental' ? RentalAnalysisResults :
        T extends 'airbnb' ? AirbnbAnalysisResults :
        T extends 'wholesale' ? WholesaleAnalysisResults :
        T extends 'mortgage' ? MortgageAnalysisResults :
        T extends 'renters' ? RentersAnalysisResults : never;
  metrics: {
    roi: number;
    cashFlow: number;
    capRate: number;
  };
  mode: T;
  createdAt: string | Date;
  updatedAt: string | Date;
  title?: string;
  notes?: string;
  source?: string;
  insights?: string;
  insightsLastGeneratedAt?: string | Date;
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

export function isRentalAnalysis(results: AnalysisResults): results is RentalAnalysisResults {
  return results.type === 'rental';
}

export function isAirbnbAnalysis(results: AnalysisResults): results is AirbnbAnalysisResults {
  return results.type === 'airbnb';
}

export function isWholesaleAnalysis(results: AnalysisResults): results is WholesaleAnalysisResults {
  return results.type === 'wholesale';
}

export interface AnalysisMetrics {
  cashFlow?: number;
  roi?: number;
  capRate?: number;
  netIncome?: number;
  totalExpenses?: number;
  grossIncome?: number;
  occupancyRate?: number;
  breakEvenOccupancy?: number;
  profitMargin?: number;
  monthlyPayment?: number;
  totalInvestment?: number;
  annualCashFlow?: number;
  monthlyCashFlow?: number;
  cashOnCashReturn?: number;
  grossRentMultiplier?: number;
  debtServiceCoverageRatio?: number;
}

// Type guard for Analysis object
export function isValidAnalysis(analysis: any): analysis is Analysis {
  return (
    analysis &&
    typeof analysis === 'object' &&
    typeof analysis.userId === 'string' &&
    typeof analysis.type === 'string' &&
    typeof analysis.data === 'object' &&
    typeof analysis.metrics === 'object' &&
    typeof analysis.mode === 'string' &&
    (typeof analysis.createdAt === 'string' || analysis.createdAt instanceof Date) &&
    (typeof analysis.updatedAt === 'string' || analysis.updatedAt instanceof Date)
  );
}
