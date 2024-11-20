import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = loadStripe(publishableKey);
export const LEAD_PRICE = 500; // $5.00 in cents

export async function createPaymentIntent(leadId: string, userId: string) {
  try {
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        leadId,
        userId
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Payment failed to initialize');
    }
    
    if (!data.clientSecret) {
      throw new Error('No client secret received');
    }
    
    return data;
  } catch (error: any) {
    console.error('Payment intent error:', error);
    throw new Error(error.message || 'Failed to initialize payment');
  }
}