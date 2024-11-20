import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Lock } from 'lucide-react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { stripePromise, LEAD_PRICE, createPaymentIntent } from '../lib/stripe';
import { useAuth } from '../store/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadId: string;
}

function CheckoutForm({ onSuccess, onError }: { onSuccess: () => void; onError: (msg: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Payment system not initialized');
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md transition duration-150 ease-in-out ${
          loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay $${LEAD_PRICE / 100}`}
      </button>
    </form>
  );
}

export default function PaymentModal({ isOpen, onClose, onSuccess, leadId }: PaymentModalProps) {
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    if (isOpen && leadId && user?.id) {
      createPaymentIntent(leadId, user.id)
        .then(data => {
          if (!mounted) return;
          
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setError('');
          } else {
            throw new Error('No client secret received');
          }
        })
        .catch(err => {
          if (!mounted) return;
          console.error('Payment intent error:', err);
          setError(err.message || 'Failed to initialize payment. Please try again.');
        });
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, leadId, user?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Purchase Lead</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You're about to purchase access to this lead for ${LEAD_PRICE / 100}.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-2">Payment Details:</p>
            <p className="font-medium">Lead Access Fee: ${LEAD_PRICE / 100}</p>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563eb',
              },
            },
          }}>
            <CheckoutForm 
              onSuccess={onSuccess}
              onError={setError}
            />
          </Elements>
        )}
        
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          <Lock className="h-4 w-4 mr-1" />
          <span>Payments are processed securely through Stripe</span>
        </div>
      </div>
    </div>
  );
}