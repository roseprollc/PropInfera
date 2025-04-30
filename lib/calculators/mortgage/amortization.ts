import type { RentalInputs } from '@/types/analysis';

/**
 * Calculates the loan amount based on purchase price and down payment percentage
 */
export function calculateLoanAmount(inputs: RentalInputs): number {
  const { purchasePrice, downPaymentPercent } = inputs;

  if (purchasePrice <= 0 || downPaymentPercent < 0 || downPaymentPercent > 100) {
    console.warn("Invalid purchase price or down payment percentage.");
    return 0;
  }

  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  return purchasePrice - downPayment;
}

/**
 * Calculates the monthly mortgage payment using the amortization formula
 */
export function calculateMonthlyMortgage(inputs: RentalInputs, loanAmount: number): number {
  const { interestRate, loanTermYears } = inputs;

  if (loanAmount <= 0 || loanTermYears <= 0 || interestRate < 0 || interestRate > 30) {
    console.warn("Invalid loan amount, interest rate, or loan term.");
    return 0;
  }

  const monthlyRate = interestRate / 100 / 12;
  const payments = loanTermYears * 12;

  if (monthlyRate === 0) {
    return loanAmount / payments;
  }

  try {
    const factor = Math.pow(1 + monthlyRate, payments);
    return (loanAmount * monthlyRate * factor) / (factor - 1);
  } catch (err) {
    console.error("Error calculating monthly mortgage:", err);
    return loanAmount / payments;
  }
}

/**
 * Calculates the principal portion of a specific mortgage payment
 */
export function calculatePrincipalPayment(
  loanAmount: number,
  monthlyRate: number,
  monthlyPayment: number,
  paymentNumber: number
): number {
  if (loanAmount <= 0 || monthlyPayment <= 0 || paymentNumber <= 0) {
    return 0;
  }

  if (monthlyRate <= 0) return monthlyPayment;

  try {
    const balanceBefore =
      loanAmount * Math.pow(1 + monthlyRate, paymentNumber - 1) -
      monthlyPayment * ((Math.pow(1 + monthlyRate, paymentNumber - 1) - 1) / monthlyRate);

    const interestPortion = balanceBefore * monthlyRate;
    return Math.max(0, monthlyPayment - interestPortion);
  } catch (err) {
    console.error("Error calculating principal:", err);
    return monthlyPayment * 0.33; // Fallback average
  }
}

/**
 * Calculates the total principal paid during a specific year of the loan
 */
export function calculateAnnualPrincipalPayment(
  loanAmount: number,
  monthlyRate: number,
  monthlyPayment: number,
  year: number
): number {
  if (loanAmount <= 0 || monthlyPayment <= 0 || year <= 0 || year > 50) {
    return 0;
  }

  try {
    let annualPrincipal = 0;
    for (let month = 1; month <= 12; month++) {
      const paymentNum = (year - 1) * 12 + month;
      annualPrincipal += calculatePrincipalPayment(
        loanAmount,
        monthlyRate,
        monthlyPayment,
        paymentNum
      );
    }
    return annualPrincipal;
  } catch (err) {
    console.error("Error calculating annual principal:", err);
    return monthlyPayment * 12 * 0.3; // Approx fallback
  }
}
