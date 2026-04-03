import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import productReducer from "@/store/slices/productSlice";
import orderReducer from "@/store/slices/orderSlice";
import checkoutReducer from "@/store/slices/checkoutSlice";
import AppRoutes from "@/routes/index";

vi.mock("@/services/product.service", () => ({
  productService: {
    getAll: vi.fn().mockResolvedValue({ products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
    getById: vi.fn().mockResolvedValue({ id: 1, name: "Phone", description: "", img: "", price: 999, category: "smartphone", stock: 10 }),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-multi-carousel", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("react-multi-carousel/lib/styles.css", () => ({}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productReducer,
      orders: orderReducer,
      checkout: checkoutReducer,
    },
  });

describe("AppRoutes", () => {
  it("renders home page on /", () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/"]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId("hero-tagline")).toBeInTheDocument();
  });

  it("renders login page on /login", () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/login"]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId("login-title")).toBeInTheDocument();
  });

  it("renders register page on /register", () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/register"]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
  });

  it("redirects unauthenticated user from /cart to /login", () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/cart"]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.queryByTestId("empty-cart")).not.toBeInTheDocument();
  });
});
