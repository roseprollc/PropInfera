import type { CalculatorInputs, RentalAnalysisResults, ProjectionYear } from '@/types/analysis';

// Initial calculator inputs with sensible defaults
export const initialCalculatorInputs: CalculatorInputs = {
  propertyAddress: '',
  purchasePrice: 300000,
  downPaymentPercent: 20,
  interestRate: 5.5,
  loanTerm: 30,
  closingCosts: 5000,
  monthlyRent: 2000,
  vacancyRatePercent: 5,
  propertyManagementPercent: 10,
  maintenancePercent: 5,
  propertyTaxAnnual: 3000,
  insuranceAnnual: 1200,
  utilitiesMonthly: 0,
  capExReservePercent: 5,
  annualAppreciationPercent: 3,
  annualRentIncreasePercent: 2,
  holdingPeriodYears: 5,
  incomeTaxRate: 25
};

/**
 * Calculate loan amount based on purchase price and down payment percentage
 */
export function calculateLoanAmount(purchasePrice: number, downPaymentPercent: number): number {
  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  return purchasePrice - downPayment;
}

/**
 * Calculate monthly mortgage payment using loan amount, interest rate, and term
 */
export function calculateMonthlyMortgage(loanAmount: number, interestRate: number, loanTerm: number): number {
  // Convert annual interest rate to monthly and from percentage to decimal
  const monthlyInterestRate = interestRate / 100 / 12;
  // Convert loan term from years to months
  const numberOfPayments = loanTerm * 12;

  // If interest rate is 0, just divide loan amount by number of payments
  if (monthlyInterestRate === 0) {
    return loanAmount / numberOfPayments;
  }

  // Calculate monthly payment using formula: P = L[i(1+i)^n]/[(1+i)^n-1]
  const powerFactor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const monthlyPayment = loanAmount * (monthlyInterestRate * powerFactor) / (powerFactor - 1);
  
  return monthlyPayment;
}

/**
 * Calculate Net Operating Income (NOI)
 */
export function calculateNOI(
  monthlyRent: number, 
  vacancyRatePercent: number,
  propertyManagementPercent: number,
  maintenancePercent: number,
  propertyTaxAnnual: number,
  insuranceAnnual: number,
  utilitiesMonthly: number,
  capExReservePercent: number
): number {
  // Annual potential rental income
  const annualRentalIncome = monthlyRent * 12;
  
  // Vacancy loss
  const vacancyLoss = (annualRentalIncome * vacancyRatePercent) / 100;
  
  // Effective gross income
  const effectiveGrossIncome = annualRentalIncome - vacancyLoss;
  
  // Operating expenses
  const propertyManagement = (effectiveGrossIncome * propertyManagementPercent) / 100;
  const maintenance = (effectiveGrossIncome * maintenancePercent) / 100;
  const capExReserve = (effectiveGrossIncome * capExReservePercent) / 100;
  const utilities = utilitiesMonthly * 12;
  
  const totalOperatingExpenses = propertyManagement + maintenance + 
    propertyTaxAnnual + insuranceAnnual + utilities + capExReserve;
  
  // Net Operating Income
  return effectiveGrossIncome - totalOperatingExpenses;
}

/**
 * Calculate Cap Rate
 */
export function calculateCapRate(noi: number, purchasePrice: number): number {
  return (noi / purchasePrice) * 100;
}

/**
 * Calculate Cash on Cash Return
 */
export function calculateCashOnCash(
  annualCashFlow: number,
  purchasePrice: number,
  downPaymentPercent: number,
  closingCosts: number
): number {
  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  const totalInvestment = downPayment + closingCosts;
  
  return (annualCashFlow / totalInvestment) * 100;
}

/**
 * Calculate Return on Investment (ROI)
 */
export function calculateROI(
  annualCashFlow: number,
  appreciationValue: number,
  principalPaydown: number,
  totalInvestment: number
): number {
  const totalReturn = annualCashFlow + appreciationValue + principalPaydown;
  return (totalReturn / totalInvestment) * 100;
}

/**
 * Calculate Gross Rent Multiplier
 */
export function calculateGRM(purchasePrice: number, annualRent: number): number {
  return purchasePrice / annualRent;
}

/**
 * Calculate Debt Service Coverage Ratio
 */
export function calculateDSCR(noi: number, annualDebtService: number): number {
  return noi / annualDebtService;
}

/**
 * Calculate Break-Even Occupancy
 */
export function calculateBreakEvenOccupancy(
  operatingExpenses: number,
  annualMortgage: number,
  annualRent: number
): number {
  const totalExpenses = operatingExpenses + annualMortgage;
  return (totalExpenses / annualRent) * 100;
}

/**
 * Generate projection years
 */
export function generateProjection(
  inputs: CalculatorInputs,
  noi: number,
  monthlyMortgage: number
): ProjectionYear[] {
  const projection: ProjectionYear[] = [];
  
  let propertyValue = inputs.purchasePrice;
  let yearlyRent = inputs.monthlyRent * 12;
  
  // Calculate initial operating expenses
  const effectiveGrossIncome = yearlyRent * (1 - inputs.vacancyRatePercent / 100);
  let operatingExpenses = effectiveGrossIncome * 
    (inputs.propertyManagementPercent + inputs.maintenancePercent + inputs.capExReservePercent) / 100 +
    inputs.propertyTaxAnnual + inputs.insuranceAnnual + (inputs.utilitiesMonthly * 12);

  const annualMortgage = monthlyMortgage * 12;
  
  for (let year = 1; year <= inputs.holdingPeriodYears; year++) {
    // Adjust values for the current year
    if (year > 1) {
      propertyValue *= (1 + inputs.annualAppreciationPercent / 100);
      yearlyRent *= (1 + inputs.annualRentIncreasePercent / 100);
      
      // Recalculate effective gross income and expenses
      const updatedEffectiveGrossIncome = yearlyRent * (1 - inputs.vacancyRatePercent / 100);
      operatingExpenses = updatedEffectiveGrossIncome * 
        (inputs.propertyManagementPercent + inputs.maintenancePercent + inputs.capExReservePercent) / 100 +
        inputs.propertyTaxAnnual * (1 + (year - 1) * 0.02) + // Assuming property tax increases by 2% annually
        inputs.insuranceAnnual * (1 + (year - 1) * 0.01) + // Assuming insurance increases by 1% annually
        (inputs.utilitiesMonthly * 12) * (1 + (year - 1) * 0.03); // Assuming utilities increase by 3% annually
    }
    
    // Calculate cash flow for this year
    const annualCashFlow = yearlyRent * (1 - inputs.vacancyRatePercent / 100) - operatingExpenses - annualMortgage;
    
    // Calculate equity growth through appreciation and principal paydown (simplified)
    const equityGrowthFromAppreciation = propertyValue * (inputs.annualAppreciationPercent / 100);
    const equityGrowthFromPrincipal = annualMortgage * 0.3; // Simplified: assuming 30% of mortgage payment goes to principal
    const totalEquityGrowth = equityGrowthFromAppreciation + equityGrowthFromPrincipal;
    
    // Calculate total return for this year
    const totalReturn = annualCashFlow + totalEquityGrowth;

    projection.push({
      year,
      propertyValue: Math.round(propertyValue),
      annualRent: Math.round(yearlyRent),
      annualExpenses: Math.round(operatingExpenses),
      annualMortgage: Math.round(annualMortgage),
      annualCashFlow: Math.round(annualCashFlow),
      equityGrowth: Math.round(totalEquityGrowth),
      totalReturn: Math.round(totalReturn)
    });
  }
  
  return projection;
}

/**
 * Calculate Internal Rate of Return (IRR) - simplified implementation
 */
export function calculateIRR(
  initialInvestment: number,
  cashFlows: number[],
  finalValue: number
): number {
  // This is a simplified IRR calculation
  // In a real implementation, you would use a more robust IRR algorithm
  const totalCashFlows = cashFlows.reduce((sum, cf) => sum + cf, 0);
  const averageAnnualReturn = (totalCashFlows + finalValue - initialInvestment) / cashFlows.length;
  return (averageAnnualReturn / initialInvestment) * 100;
}

/**
 * Main function to calculate all rental property metrics
 */
export function calculateRentalMetrics(inputs: CalculatorInputs): RentalAnalysisResults {
  // Calculate loan amount and monthly mortgage
  const loanAmount = calculateLoanAmount(inputs.purchasePrice, inputs.downPaymentPercent);
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);
  
  // Calculate Net Operating Income
  const noi = calculateNOI(
    inputs.monthlyRent,
    inputs.vacancyRatePercent,
    inputs.propertyManagementPercent,
    inputs.maintenancePercent,
    inputs.propertyTaxAnnual,
    inputs.insuranceAnnual,
    inputs.utilitiesMonthly,
    inputs.capExReservePercent
  );
  
  // Calculate cap rate
  const capRate = calculateCapRate(noi, inputs.purchasePrice);
  
  // Calculate total operating expenses
  const effectiveGrossIncome = inputs.monthlyRent * 12 * (1 - inputs.vacancyRatePercent / 100);
  const totalOperatingExpenses = effectiveGrossIncome * 
    (inputs.propertyManagementPercent + inputs.maintenancePercent + inputs.capExReservePercent) / 100 +
    inputs.propertyTaxAnnual + inputs.insuranceAnnual + (inputs.utilitiesMonthly * 12);
  
  // Calculate monthly and annual cash flow
  const annualMortgage = monthlyMortgage * 12;
  const annualCashFlow = noi - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Calculate total cash investment
  const downPayment = (inputs.purchasePrice * inputs.downPaymentPercent) / 100;
  const totalCashInvestment = downPayment + inputs.closingCosts;
  
  // Calculate cash on cash return
  const cashOnCash = calculateCashOnCash(annualCashFlow, inputs.purchasePrice, inputs.downPaymentPercent, inputs.closingCosts);
  
  // Generate projection
  const projection = generateProjection(inputs, noi, monthlyMortgage);
  
  // Calculate IRR
  const cashFlows = projection.map(year => year.annualCashFlow);
  const finalValue = projection[projection.length - 1].propertyValue;
  const irr = calculateIRR(totalCashInvestment, cashFlows, finalValue);
  
  // Calculate GRM
  const grm = calculateGRM(inputs.purchasePrice, inputs.monthlyRent * 12);
  
  // Calculate DSCR
  const dscr = calculateDSCR(noi, annualMortgage);
  
  // Calculate break-even occupancy
  const breakEvenOccupancy = calculateBreakEvenOccupancy(totalOperatingExpenses, annualMortgage, inputs.monthlyRent * 12);
  
  // Calculate ROI
  const annualAppreciation = inputs.purchasePrice * (inputs.annualAppreciationPercent / 100);
  const annualPrincipalPaydown = annualMortgage * 0.3; // Simplified: assuming 30% of mortgage payment goes to principal
  const roi = calculateROI(annualCashFlow, annualAppreciation, annualPrincipalPaydown, totalCashInvestment);
  
  return {
    monthlyCashFlow,
    annualCashFlow,
    cashOnCash,
    capRate,
    netOperatingIncome: noi,
    totalOperatingExpenses,
    monthlyMortgagePayment: monthlyMortgage,
    totalCashInvestment,
    breakEvenOccupancy,
    irr,
    fiveYearProjection: projection,
    roi,
    grossRentMultiplier: grm,
    debtServiceCoverageRatio: dscr
  };
}
 