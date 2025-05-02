'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import SavedAnalysesList from '@/components/dashboard/SavedAnalysesList';
import type { Analysis, CalculatorType } from '@/types/analysis';

export default function DashboardClient() {
  const { data: session, status } = useSession({ required: false });
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis<CalculatorType>[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = useCallback(() => {
    if (!isRedirecting && status === 'unauthenticated') {
      setIsRedirecting(true);
      router.push('/auth/signin');
    }
  }, [status, router, isRedirecting]);

  useEffect(() => {
    const timer = setTimeout(handleRedirect, 1000); // Debounce the redirect
    return () => clearTimeout(timer);
  }, [handleRedirect]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch analyses for the logged-in user
      fetch(`/api/analyses?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setAnalyses(data))
        .catch((error) => console.error("Error fetching analyses:", error));
    }
  }, [session?.user?.id]);

  if (status === 'loading') {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <CalculatorLayout title="Your Dashboard">
      <SavedAnalysesList<CalculatorType>
        analyses={analyses}
        onSelect={(analysis) => {
          // Handle analysis selection
          console.log("Selected analysis:", analysis);
        }}
      />
    </CalculatorLayout>
  );
}
