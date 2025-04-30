import { useMemo } from 'react';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_CURRENCY_SYMBOL = '$';

/**
 * Formats a number as a currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  currencySymbol: string = DEFAULT_CURRENCY_SYMBOL
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) return '—';

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  // Replace default symbol only if it differs
  return currencySymbol !== DEFAULT_CURRENCY_SYMBOL
    ? formatted.replace(DEFAULT_CURRENCY_SYMBOL, currencySymbol)
    : formatted;
}

/**
 * Formats a number as a percent string (e.g. 12.3%)
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) return '—';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
}

/**
 * Capitalizes the first letter of each word in a string
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * React hook to memoize currency formatting
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
 * React hook to memoize percentage formatting
 */
export function useFormatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  return useMemo(() => formatPercentage(value, decimals), [value, decimals]);
}
