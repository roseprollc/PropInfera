import { useMemo } from 'react';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_CURRENCY_SYMBOL = '$';

/**
 * Formats a number as currency
 * @param value - The number to format
 * @param currency - The currency code (defaults to USD)
 * @param currencySymbol - The currency symbol to use (defaults to $)
 * @returns Formatted currency string or "—" for invalid inputs
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  currencySymbol: string = DEFAULT_CURRENCY_SYMBOL
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '—';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue).replace(DEFAULT_CURRENCY_SYMBOL, currencySymbol);
}

/**
 * Formats a number as a percentage
 * @param value - The number to format
 * @param decimals - Number of decimal places (defaults to 1)
 * @returns Formatted percentage string or "—" for invalid inputs
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '—';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue / 100);
}

/**
 * Capitalizes each word in a string
 * @param text - The text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * React hook for memoized currency formatting
 */
export function useFormatCurrency(
  value: number | string | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  currencySymbol: string = DEFAULT_CURRENCY_SYMBOL
): string {
  return useMemo(
    () => formatCurrency(value, currency, currencySymbol),
    [value, currency, currencySymbol]
  );
}

/**
 * React hook for memoized percentage formatting
 */
export function useFormatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  return useMemo(
    () => formatPercentage(value, decimals),
    [value, decimals]
  );
} 