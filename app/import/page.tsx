"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock function to simulate property import
const importPropertyFromRedfin = async (url: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Importing property from:', url);
      resolve();
    }, 1500);
  });
};

// Mock property data matching CalculatorInputs interface
const mockPropertyData = {
  propertyAddress: "123 Main St, San Francisco, CA 94105",
  purchasePrice: 750000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  closingCosts: 15000,
  propertyTaxAnnual: 9000,
  insuranceAnnual: 1800,
  utilitiesMonthly: 200,
  maintenancePercent: 5,
  propertyManagementPercent: 8,
  monthlyRent: 4500,
  vacancyRatePercent: 5,
  capExReservePercent: 5,
  annualAppreciationPercent: 3,
  annualRentIncreasePercent: 2,
  holdingPeriodYears: 5,
  incomeTaxRate: 25
};

export default function SmartImport() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    return url.includes('redfin.com') && url.startsWith('http');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUrl(url)) {
      setError('Please enter a valid Redfin property URL');
      return;
    }

    setIsLoading(true);
    try {
      await importPropertyFromRedfin(url);
      // Store mock property data in sessionStorage
      sessionStorage.setItem("importedProperty", JSON.stringify(mockPropertyData));
      router.push('/renters');
    } catch (error) {
      console.error('Import failed:', error);
      setError('Failed to import property data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-[600px] w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Smart Import
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="redfin-url" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Redfin Property URL
            </label>
            <input
              type="url"
              id="redfin-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.redfin.com/..."
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-gray-700
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                placeholder:text-slate-500"
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg
              shadow-lg hover:scale-105 transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Importing...' : 'Import Property'}
          </button>
        </form>
      </div>
    </main>
  );
} 