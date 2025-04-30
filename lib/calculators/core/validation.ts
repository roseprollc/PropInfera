import type { RentalInputs } from '@/types/analysis';
import { MIN_VALUES } from './constants';

/**
 * Validates rental input fields with business logic rules.
 * Returns an array of error strings. If empty, inputs are valid.
 */
export function validateRentalInputs(inputs: RentalInputs): string[] {
  const errors: string[] = [];

  if (inputs.purchasePrice === undefined || inputs.purchasePrice < MIN_VALUES.PURCHASE_PRICE) {
    errors.push(`Purchase price must be at least $${MIN_VALUES.PURCHASE_PRICE}`);
  }

  if (
    inputs.downPaymentPercent === undefined ||
    inputs.downPaymentPercent < 0 ||
    inputs.downPaymentPercent > 100
  ) {
    errors.push('Down payment percent must be between 0 and 100');
  }

  if (
    inputs.loanTermYears === undefined ||
    inputs.loanTermYears < MIN_VALUES.LOAN_TERM_YEARS
  ) {
    errors.push('Loan term must be at least 1 year');
  }

  if (
    inputs.vacancyRatePercent === undefined ||
    inputs.vacancyRatePercent < 0 ||
    inputs.vacancyRatePercent > 100
  ) {
    errors.push('Vacancy rate percent must be between 0 and 100');
  }

  return errors;
}
