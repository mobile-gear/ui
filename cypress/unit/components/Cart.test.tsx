import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import cartReducer, { CartItem } from "@/store/slices/cartSlice";
import authReducer from "@/store/slices/authSlice";
import Cart from "@/pages/Cart";
import { User } from "@/interfaces/auth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const cartItem: CartItem = { id: 1, name: "Phone", description: "", img: "/img.jpg", price: 999, category: "", stock: 10, quantity: 2 };

const createStore = (cartItems: CartItem[] = [], user: User | null = null) =>
  configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
    preloadedState: {
      cart: {
        items: cartItems,
        totalItems: cartItems.reduce((s, i) => s + i.quantity, 0),
        totalPrice: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
      },
      auth: { user, isAuthenticated: !!user, isLoading: false, error: null },
    },
  });

const renderWith = (cartItems: CartItem[] = [], user: User | null = null) =>
  render(
    <Provider store={createStore(cartItems, user)}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );

describe("Cart", () => {
  it("shows empty cart message when no items", () => {
    renderWith();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
  });

  it("renders cart items with name and price", () => {
    renderWith([cartItem]);
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("$999.00")).toBeInTheDocument();
  });

  it("shows total price", () => {
    renderWith([cartItem]);
    expect(screen.getByText("$1998.00")).toBeInTheDocument();
  });

  it("removes item when Remove is clicked", () => {
    const store = createStore([cartItem]);
    render(
      <Provider store={store}>
        <MemoryRouter><Cart /></MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText("Remove"));
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("increments quantity with + button", () => {
    const store = createStore([cartItem]);
    render(
      <Provider store={store}>
        <MemoryRouter><Cart /></MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText("+"));
    expect(store.getState().cart.items[0].quantity).toBe(3);
  });

  it("decrements quantity with - button", () => {
    const store = createStore([cartItem]);
    render(
      <Provider store={store}>
        <MemoryRouter><Cart /></MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText("-"));
    expect(store.getState().cart.items[0].quantity).toBe(1);
  });

  it("clears cart when Clear Cart is clicked", () => {
    const store = createStore([cartItem]);
    render(
      <Provider store={store}>
        <MemoryRouter><Cart /></MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByText("Clear Cart"));
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("navigates to /login on checkout when not logged in", () => {
    renderWith([cartItem], null);
    fireEvent.click(screen.getByText("Proceed to Checkout"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to /checkout on checkout when logged in", () => {
    renderWith([cartItem], { id: 1, firstName: "John", lastName: "Doe", email: "j@e.com", role: "user" as const });
    fireEvent.click(screen.getByText("Proceed to Checkout"));
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });
});
