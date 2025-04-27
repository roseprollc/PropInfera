'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Create a client component that uses the search params
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam);
  }, [searchParams]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Error</h1>
      
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error === 'CredentialsSignin' && 'Invalid credentials. Please check your email and password.'}
          {error === 'OAuthSignin' && 'Error during OAuth sign in. Please try again.'}
          {error === 'OAuthCallback' && 'Error during OAuth callback. Please try again.'}
          {error === 'OAuthCreateAccount' && 'Error creating OAuth account. Please try again.'}
          {error === 'EmailCreateAccount' && 'Error creating email account. Please try again.'}
          {error === 'Callback' && 'Error during callback. Please try again.'}
          {error === 'OAuthAccountNotLinked' && 'Email already in use with different provider.'}
          {error === 'EmailSignin' && 'Error sending email. Please try again.'}
          {error === 'SessionRequired' && 'Authentication required. Please sign in.'}
          {!error && 'An unknown error occurred. Please try again.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Wrap the client component with Suspense
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
} 