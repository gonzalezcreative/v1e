import Stripe from 'stripe';
import { LEAD_PRICE } from '../src/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leadId, userId } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: LEAD_PRICE,
      currency: 'usd',
      metadata: {
        leadId,
        userId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}