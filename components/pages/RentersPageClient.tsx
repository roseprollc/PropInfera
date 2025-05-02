"use client";

import { CalculatorProvider } from "@/context/CalculatorContext";
import { SessionProvider } from "next-auth/react";
import RentersCalculator from "@/components/calculators/RentersCalculator";

export default function RentersPageClient() {
  return (
    <SessionProvider>
      <CalculatorProvider>
        <RentersCalculator />
      </CalculatorProvider>
    </SessionProvider>
  );
}
