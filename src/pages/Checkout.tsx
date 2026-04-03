import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { RootState, AppDispatch } from "../store";
import { createPaymentIntent, setShippingAddress } from "../store/slices/checkoutSlice";
import CheckoutForm from "../components/CheckoutForm";
import { shippingAddressSchema } from "../utils/schemas/checkoutSchemas";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const inputClass =
  "w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const errorClass = "mt-1 text-xs text-red-500";

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { clientSecret, isLoading, error, shippingAddress } = useSelector(
    (state: RootState) => state.checkout,
  );

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    const cartItems = items.map((item) => ({ productId: item.id, quantity: item.quantity }));
    dispatch(createPaymentIntent(cartItems));
  }, [dispatch, items, navigate]);

  const formik = useFormik({
    initialValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    validationSchema: shippingAddressSchema,
    onSubmit: (values) => {
      dispatch(setShippingAddress(values));
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 data-test="checkout-heading" className="text-3xl font-display font-bold text-gray-900">Checkout</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 data-test="shipping-heading" className="text-lg font-display font-bold text-gray-900 mb-6">Shipping Address</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="street" className={labelClass}>
                Street address
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
                placeholder="123 Main St"
              />
              {formik.touched.street && formik.errors.street && (
                <p className={errorClass}>{formik.errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="New York"
                />
                {formik.touched.city && formik.errors.city && (
                  <p className={errorClass}>{formik.errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="NY"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className={errorClass}>{formik.errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className={labelClass}>
                  ZIP code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="10001"
                />
                {formik.touched.zipCode && formik.errors.zipCode && (
                  <p className={errorClass}>{formik.errors.zipCode}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                  placeholder="United States"
                />
                {formik.touched.country && formik.errors.country && (
                  <p className={errorClass}>{formik.errors.country}</p>
                )}
              </div>
            </div>

            <button
              data-test="save-address"
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg transition-colors"
            >
              {shippingAddress ? "Update address" : "Save address"}
            </button>
          </form>
        </div>

        {clientSecret && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-display font-bold text-gray-900 mb-6">Payment</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 data-test="order-summary" className="text-lg font-display font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-3 text-sm text-gray-700">
                <span>
                  {item.name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-2 border-t border-gray-100 font-display font-bold text-gray-900">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
