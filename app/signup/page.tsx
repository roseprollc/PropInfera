'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'elite'>('free');

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan === 'pro' || plan === 'elite') {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Create Your Account</h1>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Plan</h2>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#111]">
              <span className="text-lg font-medium">
                {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
              </span>
              <span className="text-[#2ecc71] font-semibold">
                {selectedPlan === 'free' ? 'Free' : selectedPlan === 'pro' ? '$9/month' : '$15/month'}
              </span>
            </div>
          </div>

          {/* Placeholder for signup form */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <p className="text-gray-400 text-center">
              Signup form will be implemented in the next phase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 