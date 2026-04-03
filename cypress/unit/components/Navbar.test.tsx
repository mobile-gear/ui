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

const user: User = { id: 1, firstName: "John", lastName: "Doe", email: "j@e.com", role: "user" };
const admin: User = { ...user, role: "admin" };

const createStore = (authUser: User | null = null, cartItems: CartItem[] = []) =>
  configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState: {
      auth: { user: authUser, isAuthenticated: !!authUser, isLoading: false, error: null },
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
    expect(screen.getByText("Gear")).toBeInTheDocument();
  });

  it("shows Login and Register when not authenticated", () => {
    renderWith();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("shows user name when authenticated", () => {
    renderWith(user);
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("shows cart badge when items in cart", () => {
    renderWith(null, [{ id: 1, name: "P", description: "", img: "", price: 10, category: "", stock: 5, quantity: 1 }]);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not show cart badge when cart is empty", () => {
    renderWith();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("opens dropdown on user name click", () => {
    renderWith(user);
    fireEvent.click(screen.getByText("John"));
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows Dashboard link for admin", () => {
    renderWith(admin);
    fireEvent.click(screen.getByText("John"));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("does not show Dashboard link for regular user", () => {
    renderWith(user);
    fireEvent.click(screen.getByText("John"));
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("toggles dropdown on repeated click", () => {
    renderWith(user);
    fireEvent.click(screen.getByText("John"));
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    fireEvent.click(screen.getByText("John"));
  });

  it("handles logout", () => {
    renderWith(user);
    fireEvent.click(screen.getByText("John"));
    fireEvent.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
