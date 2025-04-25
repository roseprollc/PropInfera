"use client";

import Link from "next/link";

interface CalculatorLayoutProps {
  children: React.ReactNode;
  title?: string;
  showImportButton?: boolean;
}

export default function CalculatorLayout({
  children,
  title,
  showImportButton = false,
}: CalculatorLayoutProps) {
  return (
    <main className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto relative">
        {showImportButton && (
          <div className="absolute right-0 top-0 hidden md:block">
            <Link
              href="/import"
              className="inline-flex items-center px-4 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-[#2ecc71]/50"
            >
              Smart Import
            </Link>
          </div>
        )}
        
        {title && (
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            {title}
          </h1>
        )}
        
        {children}
      </div>
    </main>
  );
} 