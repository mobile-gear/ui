import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "@/store/slices/checkoutSlice";
import CheckoutForm from "@/components/CheckoutForm";

const mockConfirmPayment = vi.fn();
const mockStripe = { confirmPayment: mockConfirmPayment };
const mockElements = {};

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: () => <div data-test="payment-element" />,
  useStripe: () => mockStripe,
  useElements: () => mockElements,
}));

const createStore = (shippingAddress: Record<string, string> | null = null) =>
  configureStore({
    reducer: { checkout: checkoutReducer },
    preloadedState: {
      checkout: { isLoading: false, error: null, clientSecret: null, shippingAddress: shippingAddress as ReturnType<typeof checkoutReducer>["shippingAddress"], success: false },
    },
  });

const address = { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" };

const renderWith = (shippingAddress: Record<string, string> | null = null) =>
  render(
    <Provider store={createStore(shippingAddress)}>
      <CheckoutForm />
    </Provider>,
  );

describe("CheckoutForm", () => {
  it("renders PaymentElement", () => {
    renderWith(address);
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
  });

  it("shows Pay now button", () => {
    renderWith(address);
    expect(screen.getByTestId("pay-now-btn")).toBeInTheDocument();
  });

  it("disables button when no shipping address", () => {
    renderWith(null);
    expect(screen.getByTestId("pay-now-btn")).toBeDisabled();
  });

  it("shows warning when no shipping address", () => {
    renderWith(null);
    expect(screen.getByTestId("shipping-address-warning")).toBeInTheDocument();
  });

  it("enables button when shipping address is set", () => {
    renderWith(address);
    expect(screen.getByTestId("pay-now-btn")).not.toBeDisabled();
  });

  it("calls stripe.confirmPayment on submit", async () => {
    mockConfirmPayment.mockResolvedValue({ error: null });
    renderWith(address);
    fireEvent.submit(screen.getByTestId("pay-now-btn").closest("form")!);
    expect(mockConfirmPayment).toHaveBeenCalled();
  });

  it("shows error when payment fails", async () => {
    mockConfirmPayment.mockResolvedValue({ error: { message: "Card declined" } });
    renderWith(address);
    fireEvent.submit(screen.getByTestId("pay-now-btn").closest("form")!);
    await screen.findByTestId("payment-error");
  });

  it("sets no shipping address error on submit without address", () => {
    renderWith(null);
    fireEvent.submit(screen.getByTestId("pay-now-btn").closest("form")!);
    expect(screen.getByTestId("payment-error")).toBeInTheDocument();
  });
});
