'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setErrorMsg('Invalid credentials');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => signIn('google')}
            className="bg-red-500 hover:bg-red-600 text-white w-full"
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => signIn('facebook')}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            Sign in with Facebook
          </Button>
        </div>

        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="underline text-green-400">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
