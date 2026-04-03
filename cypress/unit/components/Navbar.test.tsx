import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import authReducer from "@/store/slices/authSlice";
import cartReducer, { CartItem } from "@/store/slices/cartSlice";
import Navbar from "@/components/Navbar";
import { User } from "@/interfaces/auth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const user: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "j@e.com",
  role: "user",
};
const admin: User = { ...user, role: "admin" };

const createStore = (
  authUser: User | null = null,
  cartItems: CartItem[] = [],
) =>
  configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: {
        user: authUser,
        isAuthenticated: !!authUser,
        isLoading: false,
        error: null,
      },
      cart: { items: cartItems, totalItems: cartItems.length, totalPrice: 0 },
    },
  });

const renderWith = (authUser: User | null = null, cartItems: CartItem[] = []) =>
  render(
    <Provider store={createStore(authUser, cartItems)}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>,
  );

describe("Navbar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders brand link", () => {
    renderWith();
    expect(screen.getByTestId("brand-link")).toBeInTheDocument();
  });

  it("shows Login and Register when not authenticated", () => {
    renderWith();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(screen.getByTestId("register-link")).toBeInTheDocument();
  });

  it("shows user name when authenticated", () => {
    renderWith(user);
    expect(screen.getByTestId("user-name")).toBeInTheDocument();
  });

  it("shows cart badge when items in cart", () => {
    renderWith(null, [
      {
        id: 1,
        name: "P",
        description: "",
        img: "",
        price: 10,
        category: "",
        stock: 5,
        quantity: 1,
      },
    ]);
    expect(screen.getByTestId("cart-badge")).toBeInTheDocument();
  });

  it("does not show cart badge when cart is empty", () => {
    renderWith();
    expect(screen.queryByTestId("cart-empty")).not.toBeInTheDocument();
  });

  it("opens dropdown on user name click", () => {
    renderWith(user);
    fireEvent.click(screen.getByTestId("user-name"));
    expect(screen.getByTestId("my-orders-link")).toBeInTheDocument();
    expect(screen.getByTestId("logout-link")).toBeInTheDocument();
  });

  it("shows Dashboard link for admin", () => {
    renderWith(admin);
    fireEvent.click(screen.getByTestId("user-name"));
    expect(screen.getByTestId("dashboard-link")).toBeInTheDocument();
  });

  it("does not show Dashboard link for regular user", () => {
    renderWith(user);
    fireEvent.click(screen.getByTestId("user-name"));
    expect(screen.queryByTestId("dashboard-link")).not.toBeInTheDocument();
  });

  it("toggles dropdown on repeated click", () => {
    renderWith(user);
    fireEvent.click(screen.getByTestId("user-name"));
    expect(screen.getByTestId("my-orders-link")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("user-name"));
  });

  it("handles logout", () => {
    renderWith(user);
    fireEvent.click(screen.getByTestId("user-name"));
    fireEvent.click(screen.getByTestId("logout-link"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
