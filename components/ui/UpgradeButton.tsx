'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpgradeButtonProps {
  tier: 'pro' | 'elite';
  billingCycle: 'monthly' | 'yearly';
  className?: string;
}

export default function UpgradeButton({ tier, billingCycle, className = '' }: UpgradeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: `${tier}-${billingCycle}`,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // TODO: Add error toast notification
    } finally {
      setIsLoading(false);
    }
  }, [tier, billingCycle, router]);

  const buttonText = tier === 'pro' ? 'Upgrade to Pro' : 'Upgrade to Elite';
  const buttonLabel = tier === 'pro' ? 'Upgrade to Pro plan' : 'Upgrade to Elite plan';

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-black bg-[#2ecc71] hover:scale-105 hover:shadow-[0_0_15px_rgba(46,204,113,0.5)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#111] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={buttonLabel}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
} 