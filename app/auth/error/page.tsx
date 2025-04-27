'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-[#1a1a1a] rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-center text-red-500">Authentication Error</h1>
          <p className="text-gray-400 mb-6 text-center">
            {error === 'Configuration'
              ? 'There was a problem with the server configuration.'
              : 'An error occurred during authentication.'}
          </p>
          <div className="flex justify-center">
            <Link
              href="/signin"
              className="bg-[#2ecc71] text-white py-2 px-4 rounded-lg hover:bg-[#27ae60] transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 