import Stripe from 'stripe';

// Initialize Stripe with optional configuration
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    })
  : null;

// Helper function to check if Stripe is configured
export const isStripeConfigured = () => !!process.env.STRIPE_SECRET_KEY; 