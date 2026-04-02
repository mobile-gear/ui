import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import cartReducer from "@/store/slices/cartSlice";
import checkoutReducer from "@/store/slices/checkoutSlice";
import orderReducer from "@/store/slices/orderSlice";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import { orderService } from "@/services/order.service";

vi.mock("@/services/order.service");
const mockedOrderService = vi.mocked(orderService, true);

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const address = { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" };
const cartItem = { id: 1, name: "Phone", price: 999, img: "/img.jpg", quantity: 2 };

const createStore = (shippingAddress = address as ReturnType<typeof checkoutReducer>["shippingAddress"], items = [cartItem]) =>
  configureStore({
    reducer: { cart: cartReducer, checkout: checkoutReducer, orders: orderReducer },
    preloadedState: {
      cart: { items, totalItems: items.length, totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0) },
      checkout: { isLoading: false, error: null, clientSecret: null, shippingAddress, success: false },
      orders: { orders: [], currentOrder: null, isLoading: false, error: null, pagination: null, filters: { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" as const } },
    },
  });

let originalLocation: Location;

beforeEach(() => {
  originalLocation = window.location;
});

afterEach(() => {
  Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  vi.restoreAllMocks();
});

const setSearch = (search: string) => {
  delete (window as Record<string, unknown>).location;
  (window as Record<string, unknown>).location = { ...originalLocation, search, origin: "http://localhost:3000" };
};

describe("CheckoutSuccess", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows success on valid payment", async () => {
    setSearch("?payment_intent=pi_123&redirect_status=succeeded");
    mockedOrderService.create.mockResolvedValue({
      id: 1, userId: 1, items: [{ productId: 1, quantity: 2, price: 999 }],
      total: 1998, paymentIntentId: "pi_123", status: "completed", shippingAddress: address, createdAt: "",
    });

    render(
      <Provider store={createStore()}>
        <MemoryRouter><CheckoutSuccess /></MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
  });

  it("shows error when payment_intent is missing", async () => {
    setSearch("");

    render(
      <Provider store={createStore()}>
        <MemoryRouter><CheckoutSuccess /></MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("Payment verification failed")).toBeInTheDocument();
  });

  it("shows error when redirect_status is not succeeded", async () => {
    setSearch("?payment_intent=pi_123&redirect_status=failed");

    render(
      <Provider store={createStore()}>
        <MemoryRouter><CheckoutSuccess /></MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("Payment verification failed")).toBeInTheDocument();
  });

  it("shows error when shipping address is missing", async () => {
    setSearch("?payment_intent=pi_123&redirect_status=succeeded");

    render(
      <Provider store={createStore(null)}>
        <MemoryRouter><CheckoutSuccess /></MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("Shipping address not found")).toBeInTheDocument();
  });

  it("shows error when order creation fails", async () => {
    setSearch("?payment_intent=pi_123&redirect_status=succeeded");
    mockedOrderService.create.mockRejectedValue(new Error("Server error"));

    render(
      <Provider store={createStore()}>
        <MemoryRouter><CheckoutSuccess /></MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText("Failed to create your order. Please contact support.")).toBeInTheDocument();
  });
});
