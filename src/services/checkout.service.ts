import axios from "axios";
import { CartItemPayload, PaymentIntentResponse } from "../interfaces/checkout";
import getHeaders from "../utils/getHeaders";

const API_URL = import.meta.env.VITE_API_URL;

export const checkoutService = {
  createPaymentIntent: async (items: CartItemPayload[]): Promise<PaymentIntentResponse> => {
    const { data } = await axios.post<PaymentIntentResponse>(
      `${API_URL}/checkout/create-payment-intent`,
      { items },
      getHeaders(),
    );
    return data;
  },
};
