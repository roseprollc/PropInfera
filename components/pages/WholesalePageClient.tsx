"use client";

import { CalculatorProvider } from "@/context/CalculatorContext";
import { SessionProvider } from "next-auth/react";
import WholesaleCalculator from "@/components/calculators/WholesaleCalculator";

export default function WholesalePageClient() {
  return (
    <SessionProvider>
      <CalculatorProvider>
        <WholesaleCalculator />
      </CalculatorProvider>
    </SessionProvider>
  );
}
