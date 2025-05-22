import { z } from 'zod';

const serverEnvSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1),
  MONGODB_DB: z.string().min(1),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_KEY: z.string().min(1),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_KEY: z.string().min(1),
});

/**
 * Validate environment variables at runtime
 */
export const getEnv = (key: keyof z.infer<typeof serverEnvSchema>): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

/**
 * Validate all server-side environment variables
 */
export const validateServerEnv = () => {
  try {
    serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

/**
 * Validate all client-side environment variables
 */
export const validateClientEnv = () => {
  try {
    clientEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid client environment variables: ${missingVars}`);
    }
    throw error;
  }
}; 