"use client";

import { CalculatorProvider } from "@/context/CalculatorContext";
import { SessionProvider } from "next-auth/react";
import AirbnbCalculator from "@/components/calculators/AirbnbCalculator";

export default function AirbnbPageClient() {
  return (
    <SessionProvider>
      <CalculatorProvider>
        <AirbnbCalculator />
      </CalculatorProvider>
    </SessionProvider>
  );
}
