import Stripe from 'stripe';

// Create a mock stripe instance for development/testing
const mockStripe = {
  checkout: {
    sessions: {
      create: async () => ({
        url: 'https://example.com/mock-checkout',
      }),
    },
  },
} as unknown as Stripe;

// Initialize stripe only if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    })
  : mockStripe;

export default stripe;

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}
