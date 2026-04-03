import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Cart from "@/pages/Cart";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CartItem } from "@/store/slices/cartSlice";
import authReducer from "@/store/slices/authSlice";
import { User } from "@/interfaces/auth";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createStore = (
  cartItems: CartItem[],
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin";
  } | null = null,
) =>
  configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
    preloadedState: {
      cart: {
        items: cartItems,
        totalItems:
          cartItems.length > 0
            ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
            : 0,
        totalPrice:
          cartItems.length > 0
            ? cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              )
            : 0,
      },
      auth: { user, isAuthenticated: !!user, isLoading: false, error: null },
    },
  });

const renderWithProviders = (store: ReturnType<typeof createStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );

describe("Cart - Branch Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty cart state when items.length === 0", () => {
    const store = createStore([]);
    renderWithProviders(store);

    expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    expect(screen.getByTestId("continue-shopping")).toBeInTheDocument();
  });

  it("renders cart items when items exist", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 2,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "Test Product",
    );
    expect(screen.getByTestId("cart-item-qty")).toHaveTextContent("2");
  });

  it("handles quantity decrement when quantity > 1", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 2,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    const decrementBtn = screen.getByTestId("quantity-decrement");
    fireEvent.click(decrementBtn);

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });

  it("prevents quantity decrement when quantity would be 0", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    const decrementBtn = screen.getByTestId("quantity-decrement");
    fireEvent.click(decrementBtn);

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });

  it("navigates to login when user is null during checkout", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    const checkoutBtn = screen.getByTestId("checkout-btn");
    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to checkout when user exists", () => {
    const mockUser: User = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      role: "user",
    };
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem], mockUser);
    renderWithProviders(store);

    const checkoutBtn = screen.getByTestId("checkout-btn");
    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  it("handles clear cart action", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    expect(screen.getByTestId("clear-cart-btn")).toBeInTheDocument();
  });

  it("handles remove item action", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    expect(screen.getByTestId("remove-item")).toBeInTheDocument();
  });

  it("handles quantity increment", () => {
    const mockItem: CartItem = {
      id: 1,
      name: "Test Product",
      description: "A test product",
      price: 99.99,
      category: "smartphone",
      stock: 10,
      quantity: 1,
      img: "/test.jpg",
    };
    const store = createStore([mockItem]);
    renderWithProviders(store);

    const incrementBtn = screen.getByTestId("quantity-increment");
    fireEvent.click(incrementBtn);

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });
});
