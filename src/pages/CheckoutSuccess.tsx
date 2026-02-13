import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/orderSlice";
import { RootState, AppDispatch } from "../store";
import { resetCheckout } from "../store/slices/checkoutSlice";

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = useSelector((state: RootState) => state.checkout);

  useEffect(() => {
    const createOrderFromPayment = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const paymentIntentId = searchParams.get("payment_intent");
        const paymentStatus = searchParams.get("redirect_status");

        if (!paymentIntentId || paymentStatus !== "succeeded") {
          setError("Payment verification failed");
          return;
        }

        if (!shippingAddress) {
          setError("Shipping address not found");
          return;
        }

        await dispatch(
          createOrder({
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: totalPrice,
            paymentIntentId,
            status: "completed",
            shippingAddress,
          }),
        ).unwrap();

        dispatch(clearCart());
        dispatch(resetCheckout());

        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.error("Failed to create order:", err);
        setError("Failed to create your order. Please contact support.");
      }
    };

    createOrderFromPayment();
  }, [dispatch, items, totalPrice, navigate, shippingAddress]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We're processing your order and will send
          you a confirmation email shortly.
        </p>
        <div className="text-sm text-gray-500">
          You will be redirected to your orders in a few seconds...
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
