import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from "../library/services/stripe_service";
import { createPaymentIntent } from "../library/services/stripe_service";
import { updateOrderPaymentStatus } from "../library/services/checkout_service";

const CheckoutForm = ({ order, total, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsLoading(true);
        const paymentIntent = await createPaymentIntent(
          total,
          order.orderId,
          order.sender.email
        );
        
        if (paymentIntent.success) {
          setClientSecret(paymentIntent.data.clientSecret);
        } else {
          throw new Error(paymentIntent.message || 'Failed to create payment intent');
        }
      } catch (err) {
        console.error('Payment intent creation error:', err);
        setError(err.message || 'Failed to initialize payment. Please try again.');
        onPaymentError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [total, order, onPaymentError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${order.sender.firstName} ${order.sender.lastName}`,
            email: order.sender.email,
            phone: order.sender.code + order.sender.mobile,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        try {
          await updateOrderPaymentStatus(order.orderId, 'paid');
          onPaymentSuccess(paymentIntent);
        } catch (updateError) {
          console.error('Failed to update order status:', updateError);
          onPaymentSuccess(paymentIntent);
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      onPaymentError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-[#FF8A00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600">Initializing payment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Payment</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Order Total:</span>
          <span className="text-xl font-bold text-[#FF8A00]">${total.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500">Order ID: {order.orderId}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Test: 4242 4242 4242 4242</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            !stripe || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#FF8A00] hover:bg-[#FF6B00]'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

const StripePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, total } = location.state || {};

  useEffect(() => {
    if (!order || !total) {
      navigate('/checkout');
    }
  }, [order, total, navigate]);

  if (!order || !total) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Order Found</h2>
          <p className="text-gray-600 mt-2">Redirecting to checkout...</p>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = (paymentIntent) => {
    navigate('/order-confirmation', {
      state: {
        order: order,
        orderId: order.orderId,
        paymentIntent: paymentIntent,
        paymentMethod: 'card'
      }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your payment</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            order={order}
            total={total}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/checkout')}
            className="text-[#FF8A00] hover:text-[#FF6B00] font-medium"
          >
            ← Back to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;