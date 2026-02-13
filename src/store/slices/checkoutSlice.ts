import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import getHeaders from "../../utils/getHeaders";

const API_URL = import.meta.env.VITE_API_URL;

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  clientSecret: string | null;
  shippingAddress: ShippingAddress | null;
  success: boolean;
}

const initialState: CheckoutState = {
  isLoading: false,
  error: null,
  clientSecret: null,
  shippingAddress: null,
  success: false,
};

export const createPaymentIntent = createAsyncThunk(
  "checkout/createPaymentIntent",
  async (
    cartItems: { productId: number; quantity: number }[],
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/checkout/create-payment-intent`,
        {
          items: cartItems,
        },
        getHeaders(),
      );
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create payment intent",
        );
      }
      return rejectWithValue("Failed to create payment intent");
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(
        "checkoutState",
        JSON.stringify({
          ...state,
          shippingAddress: action.payload,
        }),
      );
    },
    resetCheckout: (state) => {
      state.isLoading = false;
      state.error = null;
      state.clientSecret = null;
      state.success = false;
      localStorage.removeItem("checkoutState");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientSecret = action.payload.clientSecret;
        state.error = null;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShippingAddress, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
