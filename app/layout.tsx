import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TierProvider } from '@/context/TierContext'
import { AnalysisProvider } from '@/context/AnalysisContext'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropInfera - Property Inference Attack Detection',
  description: 'Advanced machine learning model security analysis and inference attack detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TierProvider>
            <AnalysisProvider>
              <Navbar />
              {children}
            </AnalysisProvider>
          </TierProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
