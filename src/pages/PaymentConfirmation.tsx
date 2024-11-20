import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setStatus('success');
    } else if (redirectStatus === 'failed') {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        {status === 'success' ? (
          <>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-gray-600 text-center">
                Your lead purchase was successful. You can now access the lead details.
              </p>
            </div>
            <button
              onClick={() => navigate('/business')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
            >
              View Lead Details
            </button>
          </>
        ) : status === 'error' ? (
          <>
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
              <p className="mt-2 text-gray-600 text-center">
                There was an issue processing your payment. Please try again.
              </p>
            </div>
            <button
              onClick={() => navigate('/business')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
            >
              Return to Business Portal
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Processing Payment</h2>
            <p className="mt-2 text-gray-600 text-center">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}