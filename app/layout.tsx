import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import { TierProvider } from '@/context/TierContext'
import { AnalysisProvider } from '@/context/AnalysisContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropInfera - Real Estate Investment Analysis',
  description: 'Advanced real estate investment analysis tools and calculators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#111] text-white min-h-screen`}>
        <TierProvider>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </TierProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid #2ecc71',
            },
            success: {
              style: {
                background: '#111',
                color: '#2ecc71',
                border: '1px solid #2ecc71',
              },
              iconTheme: {
                primary: '#2ecc71',
                secondary: '#111',
              },
            },
            error: {
              style: {
                background: '#111',
                color: '#e74c3c',
                border: '1px solid #e74c3c',
              },
              iconTheme: {
                primary: '#e74c3c',
                secondary: '#111',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
