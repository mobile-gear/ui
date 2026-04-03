import React, { FormEvent, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { shippingAddress } = useSelector((state: RootState) => state.checkout);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingAddress) {
      setError("Please fill in your shipping address first");
      return;
    }

    setIsProcessing(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form data-test="checkout-form" onSubmit={handleSubmit}>
      <PaymentElement data-test="payment-element" />
      {error && (
        <div data-test="payment-error" className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      <button
        data-test="pay-now-btn"
        type="submit"
        disabled={!stripe || isProcessing || !shippingAddress}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
      {!shippingAddress && (
        <p
          data-test="shipping-address-warning"
          className="mt-2 text-sm text-gray-600"
        >
          Please fill in your shipping address before proceeding with payment.
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
