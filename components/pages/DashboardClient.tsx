'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import SavedAnalysesList from '@/components/dashboard/SavedAnalysesList';
import DashboardProvider from '@/components/providers/DashboardProvider';
import type { Analysis, CalculatorType } from '@/types/analysis';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis<CalculatorType>[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = useCallback(() => {
    if (!isRedirecting && status === 'unauthenticated') {
      setIsRedirecting(true);
      router.push('/auth/signin');
    }
  }, [status, router, isRedirecting]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const timer = setTimeout(handleRedirect, 1000); // Debounce the redirect
      return () => clearTimeout(timer);
    }
  }, [status, handleRedirect]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch analyses for the logged-in user
      fetch(`/api/analyses?userId=${session.user.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch analyses');
          }
          return res.json();
        })
        .then((data) => setAnalyses(data))
        .catch((error) => {
          console.error("Error fetching analyses:", error);
          setError('Failed to load analyses. Please try again.');
        });
    }
  }, [session?.user?.id]);

  if (status === 'loading') {
    return (
      <CalculatorLayout title="Your Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading...</p>
        </div>
      </CalculatorLayout>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <CalculatorLayout title="Your Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </CalculatorLayout>
    );
  }

  if (error) {
    return (
      <CalculatorLayout title="Your Dashboard">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout title="Your Dashboard">
      <SavedAnalysesList
        analyses={analyses}
        onSelect={(analysis) => {
          // Handle analysis selection
          console.log("Selected analysis:", analysis);
        }}
      />
    </CalculatorLayout>
  );
}

export default function DashboardClient() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
