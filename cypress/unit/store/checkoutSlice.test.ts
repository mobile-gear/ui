import { describe, it, expect, vi, beforeEach } from "vitest";
import checkoutReducer, {
  setShippingAddress,
  resetCheckout,
} from "@/store/slices/checkoutSlice";

const mockAddress = {
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  zipCode: "62704",
  country: "US",
};

const initialState = {
  isLoading: false,
  error: null,
  clientSecret: null,
  shippingAddress: null,
  success: false,
};

describe("checkoutSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the initial state", () => {
    expect(checkoutReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  describe("setShippingAddress", () => {
    it("sets the shipping address", () => {
      const state = checkoutReducer(
        initialState,
        setShippingAddress(mockAddress),
      );
      expect(state.shippingAddress).toEqual(mockAddress);
    });

    it("persists the address to localStorage", () => {
      const spy = vi.spyOn(Storage.prototype, "setItem");
      checkoutReducer(initialState, setShippingAddress(mockAddress));
      expect(spy).toHaveBeenCalledWith(
        "checkoutState",
        expect.stringContaining("123 Main St"),
      );
      spy.mockRestore();
    });
  });

  describe("resetCheckout", () => {
    it("resets the state", () => {
      const dirtyState = {
        isLoading: true,
        error: "something went wrong",
        clientSecret: "secret_123",
        shippingAddress: mockAddress,
        success: true,
      };
      const state = checkoutReducer(dirtyState, resetCheckout());
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.clientSecret).toBeNull();
      expect(state.success).toBe(false);
    });

    it("removes checkoutState from localStorage", () => {
      const spy = vi.spyOn(Storage.prototype, "removeItem");
      checkoutReducer(initialState, resetCheckout());
      expect(spy).toHaveBeenCalledWith("checkoutState");
      spy.mockRestore();
    });
  });
});
