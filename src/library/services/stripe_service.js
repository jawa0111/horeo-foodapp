import { loadStripe } from "@stripe/stripe-js";

// Use your publishable key from environment variables - FIXED for Vite
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create payment intent
export const createPaymentIntent = async (amount, orderId, customerEmail) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
      }/payment/create-payment-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          orderId: orderId,
          customerEmail: customerEmail,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create payment intent");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Confirm payment
export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
      }/payment/confirm-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to confirm payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export default stripePromise;
