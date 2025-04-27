import Hero from '@/components/sections/Hero';
import CalculatorTiles from '@/components/sections/CalculatorTiles';
import HowItWorks from '@/components/sections/HowItWorks';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <CalculatorTiles />
      <HowItWorks />
      <Footer />
    </main>
  );
} 