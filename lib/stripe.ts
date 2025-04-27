import Stripe from 'stripe';

// Initialize Stripe with a fallback for environments without the API key
let stripe: Stripe | null = null;

// Only initialize if we have an API key
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use the latest stable API version
  });
}

// Helper function to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export default stripe; 