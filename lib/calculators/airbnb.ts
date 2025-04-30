import type { AirbnbInputs, AirbnbAnalysisResults } from '@/types/analysis';

export function calculateAirbnbMetrics(inputs: AirbnbInputs): Omit<AirbnbAnalysisResults, 'type'> {
  const {
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    averageNightlyRate,
    occupancyRatePercent,
    cleaningFeePerStay,
    averageStayDurationNights,
    propertyTaxesYearly,
    insuranceCostMonthly,
    utilitiesMonthlyCost,
    maintenancePercent,
    propertyManagementPercent
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Calculate monthly revenue
  const daysPerMonth = 30.44; // Average days per month
  const occupancyDecimal = occupancyRatePercent / 100;
  const averageBookedNightsPerMonth = daysPerMonth * occupancyDecimal;
  const monthlyCleaningFeeRevenue = cleaningFeePerStay * (averageBookedNightsPerMonth / averageStayDurationNights);
  const monthlyRoomRevenue = averageNightlyRate * averageBookedNightsPerMonth;
  const monthlyRevenue = monthlyRoomRevenue + monthlyCleaningFeeRevenue;

  // Calculate monthly operating expenses
  const monthlyPropertyTax = propertyTaxesYearly / 12;
  const monthlyInsurance = insuranceCostMonthly;
  const monthlyMaintenance = purchasePrice * (maintenancePercent / 100) / 12;
  const monthlyManagement = monthlyRevenue * (propertyManagementPercent / 100);
  const monthlyOperatingExpenses = 
    monthlyPropertyTax +
    monthlyInsurance +
    utilitiesMonthlyCost +
    monthlyMaintenance +
    monthlyManagement;

  // Calculate cash flow metrics
  const monthlyCashFlow = monthlyRevenue - monthlyOperatingExpenses - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const totalCashInvestment = downPayment + (purchasePrice * (inputs.closingCostsPercent / 100));
  const roi = (annualCashFlow / totalCashInvestment) * 100;
  const netOperatingIncome = monthlyRevenue - monthlyOperatingExpenses;
  const breakEvenOccupancy = ((monthlyOperatingExpenses + monthlyPayment) / (averageNightlyRate + cleaningFeePerStay / averageStayDurationNights)) / daysPerMonth * 100;

  return {
    monthlyAirbnbIncome: monthlyRevenue,
    annualCashFlow,
    roi,
    netOperatingIncome,
    totalOperatingExpenses: monthlyOperatingExpenses,
    monthlyMortgagePayment: monthlyPayment,
    totalCashInvestment,
    breakEvenOccupancy,
    averageDailyRate: averageNightlyRate,
    projectedAnnualIncome: monthlyRevenue * 12,
    monthlyBreakdown: []
  };
} 