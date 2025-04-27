import { AirbnbInputs, AnalysisResultsMap } from '@/types/analysis';

export function calculateAirbnbMetrics(inputs: AirbnbInputs): Omit<AnalysisResultsMap['airbnb'], 'type'> {
  const {
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    nightlyRate = 0,
    occupancyRate = 0,
    cleaningFee = 0,
    platformFeesPercent = 0,
    propertyTaxAnnual,
    insuranceAnnual,
    utilitiesMonthly,
    maintenancePercent,
    propertyManagementPercent
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Calculate monthly revenue
  const daysPerMonth = 30.44; // Average days per month
  const occupancyDecimal = occupancyRate / 100;
  const averageBookedNightsPerMonth = daysPerMonth * occupancyDecimal;
  const monthlyCleaningFeeRevenue = cleaningFee * (averageBookedNightsPerMonth / 3); // Assume average 3-night stays
  const monthlyRoomRevenue = nightlyRate * averageBookedNightsPerMonth;
  const platformFees = (monthlyRoomRevenue + monthlyCleaningFeeRevenue) * (platformFeesPercent / 100);
  const monthlyRevenue = monthlyRoomRevenue + monthlyCleaningFeeRevenue - platformFees;

  // Calculate monthly operating expenses
  const monthlyPropertyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyMaintenance = purchasePrice * (maintenancePercent / 100) / 12;
  const monthlyManagement = monthlyRevenue * (propertyManagementPercent / 100);
  const monthlyOperatingExpenses = 
    monthlyPropertyTax +
    monthlyInsurance +
    utilitiesMonthly +
    monthlyMaintenance +
    monthlyManagement;

  // Calculate cash flow metrics
  const monthlyCashFlow = monthlyRevenue - monthlyOperatingExpenses - monthlyPayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
  const capRate = ((monthlyRevenue - monthlyOperatingExpenses) * 12 / purchasePrice) * 100;

  return {
    monthlyPayment,
    principalAndInterest: monthlyPayment,
    totalMonthlyPayment: monthlyPayment + monthlyOperatingExpenses,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate
  };
} 