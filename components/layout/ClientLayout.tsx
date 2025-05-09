'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

class DynamicImportErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Error loading ${this.props.componentName}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Error loading {this.props.componentName}. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

// Add error handling for dynamic imports
const Providers = dynamic(
  () => import('@/components/providers/providers').then(mod => mod.Providers),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading providers...</div>
  }
);

const Navbar = dynamic(() => import('@/components/layout/Navbar'), {
  ssr: false,
  loading: () => (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-primary">PropInfera</div>
        </div>
      </div>
    </nav>
  )
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <DynamicImportErrorBoundary componentName="Providers">
        <Providers>
          <DynamicImportErrorBoundary componentName="Navbar">
            <Navbar />
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </DynamicImportErrorBoundary>
        </Providers>
      </DynamicImportErrorBoundary>
    </Suspense>
  );
} 