import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      tier: 'free' | 'pro' | 'elite';
    } & DefaultSession['user'];
  }

  interface User {
    tier: 'free' | 'pro' | 'elite';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    tier: 'free' | 'pro' | 'elite';
  }
} 