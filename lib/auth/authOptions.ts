import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import { getDb } from '@/lib/mongodb';
import { User, UserTier } from '@/types/user';

const users = [
  { id: "1", email: "test@example.com", password: "$2b$10$X5s5K123456789exampleHashed", tier: "free" } // bcrypt hash of "password"
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        // TODO: Add proper password hashing
        if (user.password !== credentials.password) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          tier: user.tier as UserTier
        } as User;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.tier = user.tier;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.tier = token.tier as UserTier;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
