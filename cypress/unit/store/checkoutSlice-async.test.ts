import { describe, it, expect, vi, beforeEach } from "vitest";
import checkoutReducer, {
  createPaymentIntent,
} from "@/store/slices/checkoutSlice";
import { configureStore } from "@reduxjs/toolkit";
import { checkoutService } from "@/services/checkout.service";
import { AxiosError, AxiosHeaders } from "axios";

vi.mock("@/services/checkout.service");
const mockedService = vi.mocked(checkoutService, true);

const createStore = () =>
  configureStore({ reducer: { checkout: checkoutReducer } });

describe("checkoutSlice async", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets clientSecret on createPaymentIntent success", async () => {
    mockedService.createPaymentIntent.mockResolvedValue({
      clientSecret: "cs_123",
    });
    const store = createStore();
    await store.dispatch(createPaymentIntent([{ productId: 1, quantity: 2 }]));
    const state = store.getState().checkout;
    expect(state.clientSecret).toBe("cs_123");
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets loading during pending", async () => {
    let resolvePromise: (v: { clientSecret: string }) => void;
    mockedService.createPaymentIntent.mockReturnValue(
      new Promise((r) => {
        resolvePromise = r;
      }),
    );
    const store = createStore();
    const promise = store.dispatch(
      createPaymentIntent([{ productId: 1, quantity: 1 }]),
    );
    expect(store.getState().checkout.isLoading).toBe(true);
    resolvePromise!({ clientSecret: "cs" });
    await promise;
  });

  it("sets error on AxiosError rejection", async () => {
    const axiosErr = new AxiosError("fail", "ERR", undefined, undefined, {
      data: { message: "Payment failed" },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    mockedService.createPaymentIntent.mockRejectedValue(axiosErr);
    const store = createStore();
    await store.dispatch(createPaymentIntent([{ productId: 1, quantity: 1 }]));
    expect(store.getState().checkout.error).toBe("Payment failed");
    expect(store.getState().checkout.isLoading).toBe(false);
  });

  it("sets generic error on non-Axios rejection", async () => {
    mockedService.createPaymentIntent.mockRejectedValue(new Error("network"));
    const store = createStore();
    await store.dispatch(createPaymentIntent([{ productId: 1, quantity: 1 }]));
    expect(store.getState().checkout.error).toBe(
      "Failed to create payment intent",
    );
  });
});
