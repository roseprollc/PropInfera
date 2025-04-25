"use client";

import Link from 'next/link';

interface CalculatorTile {
  title: string;
  subtitle: string;
  href: string;
}

const calculatorTiles: CalculatorTile[] = [
  {
    title: "Renters Calculator",
    subtitle: "Analyze long-term rental cash flow and ROI",
    href: "/renters"
  },
  {
    title: "Airbnb Calculator",
    subtitle: "Evaluate short-term rental income and seasonal adjustments",
    href: "/airbnb"
  },
  {
    title: "Wholesale Calculator",
    subtitle: "Calculate MAO, assignment fees, and deal potential",
    href: "/wholesale"
  },
  {
    title: "Smart Import",
    subtitle: "Import Redfin or Zillow data to auto-fill property info",
    href: "/import"
  }
];

export default function CalculatorTiles() {
  return (
    <section className="w-full bg-[#111111] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calculatorTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group block p-6 bg-black/50 border border-gray-800 rounded-lg
                hover:border-green-500 hover:shadow-[0_0_15px_#2ecc71]
                transition-all duration-300 ease-in-out transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Go to ${tile.title}`}
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">
                {tile.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {tile.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 