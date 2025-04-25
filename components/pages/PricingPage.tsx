'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import UpgradeButton from '@/components/ui/UpgradeButton';

interface PricingTier {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  highlight?: boolean;
  yearlySavings?: string;
  tier: 'free' | 'pro' | 'elite';
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    tier: 'free',
    price: {
      monthly: '$0',
      yearly: '$0',
    },
    features: [
      'Automated property calculations',
      'Smart URL import',
      'Email-based support',
      'Limited to 1 property',
    ],
  },
  {
    name: 'Pro',
    tier: 'pro',
    price: {
      monthly: '$9',
      yearly: '$59',
    },
    features: [
      'Everything in Free',
      'Market analysis tools',
      'AI-powered Smart Analysis',
      'Priority support',
      'Up to 5 properties',
    ],
    highlight: true,
    yearlySavings: '45%',
  },
  {
    name: 'Elite',
    tier: 'elite',
    price: {
      monthly: '$15',
      yearly: '$139',
    },
    features: [
      'Everything in Pro',
      'AI Agent (real estate automation)',
      'Full AI investment analysis',
      'Dedicated expert guidance',
      'Unlimited properties',
      'API access',
      'Custom reports',
    ],
    yearlySavings: '23%',
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const toggleBillingCycle = () => {
    setIsYearly(!isYearly);
  };

  const memoizedTiers = useMemo(() => tiers, []);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Flexible Plans for Every Investor
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Start free, upgrade as you grow.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={`text-sm ${!isYearly ? 'text-[#2ecc71]' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={toggleBillingCycle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#111] ${
              isYearly ? 'bg-[#2ecc71]' : 'bg-gray-600'
            }`}
            role="switch"
            aria-checked={isYearly}
            aria-label="Toggle billing cycle"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'text-[#2ecc71]' : 'text-gray-400'}`}>
            Yearly
          </span>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {memoizedTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg p-8 ${
                tier.highlight
                  ? 'border-2 border-[#2ecc71] bg-[#1a1a1a]'
                  : 'border border-gray-800 bg-[#111]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{tier.name}</h2>
                {tier.highlight && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#2ecc71] text-black">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-[#2ecc71]">
                  {isYearly ? tier.price.yearly : tier.price.monthly}
                </span>
                <span className="text-gray-400">
                  {isYearly ? '/year' : '/month'}
                </span>
              </div>
              {isYearly && tier.yearlySavings && (
                <div className="mb-4">
                  <span className="text-sm text-[#2ecc71] font-semibold">
                    Save {tier.yearlySavings}
                  </span>
                </div>
              )}
              {isYearly && (
                <div className="mb-6">
                  <span className="text-sm text-gray-400">
                    Billed annually
                  </span>
                </div>
              )}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-[#2ecc71]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.tier === 'free' ? (
                <Link
                  href="/signup"
                  className="block w-full py-3 px-6 text-center rounded-lg font-semibold transition-all duration-200 bg-gray-800 text-white hover:bg-gray-700"
                >
                  Get Started
                </Link>
              ) : (
                <UpgradeButton tier={tier.tier} className="w-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-400">
              Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.
            </p>
          </div>
          <div className="border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-gray-400">
              The Free tier is always available at no cost. For Pro and Elite tiers, we occasionally offer free trials during promotional periods.
            </p>
          </div>
          <div className="border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400">
              We accept all major credit cards and will soon support additional payment methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 