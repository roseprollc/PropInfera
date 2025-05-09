import { Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import CalculatorTiles from '@/components/sections/CalculatorTiles';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <main>
        <Hero />
        <CalculatorTiles />
      </main>
    </Suspense>
  );
} 