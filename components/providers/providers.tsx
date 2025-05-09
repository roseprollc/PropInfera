'use client';

import React, { useEffect, useState } from 'react';
import { TierProvider } from '@/context/TierContext';
import { AnalysisProvider } from '@/context/AnalysisContext';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'react-hot-toast';

class ProviderErrorBoundary extends React.Component<
  { children: React.ReactNode; providerName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; providerName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Error in ${this.props.providerName}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Error initializing {this.props.providerName}. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Providers: Initializing...');
    setMounted(true);
    console.log('Providers: Mounted successfully');
  }, []);

  if (!mounted) {
    console.log('Providers: Not mounted yet, returning null');
    return null;
  }

  console.log('Providers: Rendering with all providers');
  return (
    <ProviderErrorBoundary providerName="ThemeProvider">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ProviderErrorBoundary providerName="TierProvider">
          <TierProvider>
            <ProviderErrorBoundary providerName="AnalysisProvider">
              <AnalysisProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: '',
                    style: {
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                    success: {
                      style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--primary))',
                        border: '1px solid hsl(var(--primary))',
                      },
                      iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'hsl(var(--background))',
                      },
                    },
                    error: {
                      style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--destructive))',
                        border: '1px solid hsl(var(--destructive))',
                      },
                      iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--background))',
                      },
                    },
                  }}
                />
              </AnalysisProvider>
            </ProviderErrorBoundary>
          </TierProvider>
        </ProviderErrorBoundary>
      </ThemeProvider>
    </ProviderErrorBoundary>
  );
} 