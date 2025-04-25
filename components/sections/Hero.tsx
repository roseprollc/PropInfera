"use client";

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="h-screen bg-black flex items-center justify-center px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">
          PropInfera
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-8">
          AI-powered real estate investment tools for rentals, Airbnb, wholesale, and more
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/import"
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded shadow-lg hover:scale-105 transition hover:shadow-green-500/50 hover:ring-2 hover:ring-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Smart Import
          </Link>
          <Link
            href="#how-it-works"
            className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold px-6 py-3 rounded shadow-lg hover:scale-105 transition hover:shadow-green-500/50 hover:ring-2 hover:ring-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
} 