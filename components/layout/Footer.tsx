"use client";

import Link from 'next/link';

const currentYear = new Date().getFullYear();

const trustBadges = [
  "Backed by AI",
  "Privacy-focused",
  "Transparent Pricing"
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-slate-800 text-xs px-3 py-1 text-[#2ecc71]
                hover:bg-slate-700 transition-colors duration-200"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-300 text-sm">
            © {currentYear} PropInfera. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-slate-300 hover:text-[#2ecc71] text-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-slate-300 hover:text-[#2ecc71] text-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-slate-300 hover:text-[#2ecc71] text-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 