"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Mocked async Redfin import (replace with real API call in production)
const importPropertyFromRedfin = async (url: string): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url.includes("redfin.com")) {
        reject(new Error("Invalid Redfin URL"));
        return;
      }
      resolve({
        propertyAddress: "123 Main St, San Francisco, CA 94105",
        purchasePrice: 750000,
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTermYears: 30,
        closingCostsPercent: 2,
        propertyTaxesYearly: 9000,
        insuranceCostMonthly: 150,
        utilitiesMonthlyCost: 200,
        maintenancePercent: 5,
        propertyManagementPercent: 8,
        monthlyRent: 4500,
        vacancyRatePercent: 5,
        capExReservePercent: 5,
        annualAppreciationPercent: 3,
        annualRentIncreasePercent: 2,
        holdingPeriodYears: 5,
      });
    }, 1200);
  });
};

export default function ImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidRedfinUrl = (input: string): boolean =>
    input.startsWith("http") && input.includes("redfin.com");

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidRedfinUrl(url)) {
      setError("Please enter a valid Redfin property URL");
      return;
    }

    setIsLoading(true);

    try {
      const data = await importPropertyFromRedfin(url);
      sessionStorage.setItem("importedProperty", JSON.stringify(data));
      toast({ title: "Import Successful", description: "Property data loaded into calculator." });
      router.push("/renters");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Unable to import property details from Redfin.";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Smart Import</h1>
        <form onSubmit={handleImport} className="space-y-6">
          <div>
            <label htmlFor="redfin-url" className="block text-sm font-medium text-slate-300 mb-2">
              Redfin Property URL
            </label>
            <input
              id="redfin-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.redfin.com/..."
              className="w-full px-4 py-3 bg-slate-800 border border-gray-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Importing..." : "Import Property"}
          </button>
        </form>
      </div>
    </main>
  );
}
