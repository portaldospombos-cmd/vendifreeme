import React, { useState } from 'react';
import { StripeCardElement } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../../lib/stripe';
import { Elements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount, onFinish }: { amount: number, onFinish: (success: boolean) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100 }), // Stripe uses cents
    });
    
    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as unknown as StripeCardElement,
      },
    });

    if (result.error) {
      setError(result.error.message || 'Erro no pagamento');
      setProcessing(false);
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        onFinish(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
      <h4 className="font-bold text-lg">Informações do Cartão</h4>
      <CardElement className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20" />
      {error && <p className="text-error text-sm">{error}</p>}
      <button 
        disabled={!stripe || processing}
        className="w-full signature-gradient text-white py-4 rounded-full font-bold"
      >
        {processing ? 'Processando...' : 'Pagar Agora'}
      </button>
    </form>
  );
};

export const SecurePaymentWrapper = ({ amount, onFinish }: { amount: number, onFinish: (success: boolean) => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onFinish={onFinish} />
    </Elements>
  );
};
