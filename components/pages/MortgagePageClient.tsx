"use client";

import { CalculatorProvider } from "@/context/CalculatorContext";
import { SessionProvider } from "next-auth/react";
import CalculatorLayout from "@/components/layout/CalculatorLayout";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";

export default function MortgagePageClient() {
  return (
    <SessionProvider>
      <CalculatorProvider>
        <CalculatorLayout
          title="Mortgage Calculator"
          showImportButton={true}
        >
          <MortgageCalculator />
        </CalculatorLayout>
      </CalculatorProvider>
    </SessionProvider>
  );
}
