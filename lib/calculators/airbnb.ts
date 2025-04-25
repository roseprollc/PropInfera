import { CalculatorInput } from '@/types/calculator';

export function calculateAirbnbMetrics(inputs: CalculatorInput): Record<string, number> {
  // Placeholder calculations - implement real logic later
  const {
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    monthlyRent,
    propertyTaxAnnual,
    insuranceAnnual,
    utilitiesMonthly,
    maintenancePercent,
    propertyManagementPercent,
    vacancyRatePercent,
    capExReservePercent
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  const monthlyMortgagePayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const monthlyPropertyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyMaintenance = purchasePrice * (maintenancePercent / 100) / 12;
  const monthlyManagement = monthlyRent * (propertyManagementPercent / 100);
  const monthlyVacancy = monthlyRent * (vacancyRatePercent / 100);
  const monthlyCapEx = purchasePrice * (capExReservePercent / 100) / 12;

  const totalMonthlyExpenses = 
    monthlyMortgagePayment +
    monthlyPropertyTax +
    monthlyInsurance +
    utilitiesMonthly +
    monthlyMaintenance +
    monthlyManagement +
    monthlyVacancy +
    monthlyCapEx;

  const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
  const capRate = (annualCashFlow / purchasePrice) * 100;

  return {
    monthlyMortgagePayment,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate
  };
} 