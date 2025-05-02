import type { Metadata } from "next";
import RentersPageClient from "@/components/pages/RentersPageClient";

export const metadata: Metadata = {
  title: "Renters Calculator | PropInfera",
  description: "Calculate and compare renting vs buying a property",
};

export default function RentersPage() {
  return <RentersPageClient />;
}
