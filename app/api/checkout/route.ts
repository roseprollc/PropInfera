import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const priceMap = {
  'pro-monthly': 'price_1RHsKBArp6zvE2JagJrM5eoJ',
  'pro-yearly': 'price_1RHsKfArp6zvE2Ja5bOtg8z3',
  'elite-monthly': 'price_1RHsLEArp6zvE2JaJtnMbiHL',
  'elite-yearly': 'price_1RHsLfArp6zvE2JawPsQHfkP',
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan || !(plan in priceMap)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceMap[plan as keyof typeof priceMap],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 