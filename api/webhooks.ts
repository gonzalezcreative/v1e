import Stripe from 'stripe';
import { db } from '../src/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { leadId, userId } = paymentIntent.metadata;

    try {
      // Update lead status in Firestore
      const leadRef = doc(db, 'leads', leadId);
      const leadDoc = await getDoc(leadRef);

      if (leadDoc.exists() && leadDoc.data().status === 'New') {
        await updateDoc(leadRef, {
          status: 'Purchased',
          purchasedBy: userId,
          purchasedAt: new Date().toISOString(),
          paymentIntentId: paymentIntent.id
        });
      }

      // Add payment record
      await addDoc(collection(db, 'payments'), {
        leadId,
        userId,
        amount: paymentIntent.amount,
        status: 'succeeded',
        paymentIntentId: paymentIntent.id,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing payment success:', error);
      return res.status(500).json({ error: 'Failed to process payment success' });
    }
  }

  res.json({ received: true });
}