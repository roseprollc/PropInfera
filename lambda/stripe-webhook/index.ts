import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getWebhookSecret } from '@/lib/aws-ssm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  apiVersion: '2025-03-31.basil',
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const sig = event.headers['stripe-signature'];
    const payload = event.body || '';
    const webhookSecret = await getWebhookSecret();

    const stripeEvent = stripe.webhooks.constructEvent(
      payload,
      sig || '',
      webhookSecret
    );

    // Process the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('Error processing webhook:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
    };
  }
}; 