import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/providers';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false
});

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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
