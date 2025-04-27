'use client';

import { TierProvider } from '@/context/TierContext';
import { AnalysisProvider } from '@/context/AnalysisContext';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TierProvider>
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
      </TierProvider>
    </ThemeProvider>
  );
} 