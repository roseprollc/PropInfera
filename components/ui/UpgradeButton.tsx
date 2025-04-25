'use client';

import { useCallback } from 'react';
import Link from 'next/link';

interface UpgradeButtonProps {
  tier: 'pro' | 'elite';
  className?: string;
}

export default function UpgradeButton({ tier, className = '' }: UpgradeButtonProps) {
  const handleClick = useCallback(() => {
    // Analytics or other tracking can be added here
    console.log(`Upgrade to ${tier} clicked`);
  }, [tier]);

  const buttonText = tier === 'pro' ? 'Upgrade to Pro' : 'Upgrade to Elite';
  const buttonLabel = tier === 'pro' ? 'Upgrade to Pro plan' : 'Upgrade to Elite plan';

  return (
    <Link
      href={`/signup?plan=${tier}`}
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-black bg-[#2ecc71] hover:scale-105 hover:shadow-[0_0_15px_rgba(46,204,113,0.5)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#111] ${className}`}
      aria-label={buttonLabel}
    >
      {buttonText}
    </Link>
  );
} 