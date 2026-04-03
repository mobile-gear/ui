import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import authReducer from "@/store/slices/authSlice";
import productReducer from "@/store/slices/productSlice";
import Home from "@/pages/Home";
import { User } from "@/interfaces/auth";
import { productService } from "@/services/product.service";

vi.mock("@/services/product.service");
const mockedService = vi.mocked(productService, true);

vi.mock("react-multi-carousel", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-multi-carousel/lib/styles.css", () => ({}));

const mockProducts = [
  { id: 1, name: "Phone", description: "A phone", img: "/img.jpg", price: 999, category: "smartphone", stock: 10 },
];

const createStore = (user: User | null = null) =>
  configureStore({
    reducer: { auth: authReducer, products: productReducer },
    preloadedState: {
      auth: { user, isAuthenticated: !!user, isLoading: false, error: null },
      products: {
        products: mockProducts,
        loading: false,
        error: null,
        pagination: null,
        selectedProduct: null,
        filters: { searchTerm: "", page: 1 },
      },
    },
  });

const renderWith = (user: User | null = null) => {
  mockedService.getAll.mockResolvedValue({ products: mockProducts, pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } });
  return render(
    <Provider store={createStore(user)}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Home", () => {
  it("shows guest buttons when not authenticated", () => {
    renderWith();
    expect(screen.getByTestId("get-started-btn")).toBeInTheDocument();
    expect(screen.getByTestId("browse-btn")).toBeInTheDocument();
  });

  it("shows welcome message for authenticated user", () => {
    renderWith({ id: 1, firstName: "John", lastName: "Doe", email: "j@e.com", role: "user" });
    expect(screen.getByTestId("welcome-message")).toBeInTheDocument();
    expect(screen.getByTestId("ready-message")).toBeInTheDocument();
    expect(screen.getByTestId("shop-now-btn")).toBeInTheDocument();
  });

  it("shows admin message for admin user", () => {
    renderWith({ id: 1, firstName: "Admin", lastName: "User", email: "a@e.com", role: "admin" });
    expect(screen.getByTestId("welcome-message")).toBeInTheDocument();
    expect(screen.getByTestId("ready-message")).toBeInTheDocument();
    expect(screen.getByTestId("shop-now-btn")).toBeInTheDocument();
  });

  it("renders hero subtitle", () => {
    renderWith();
    expect(screen.getByTestId("hero-subtitle")).toBeInTheDocument();
  });

  it("renders category section", () => {
    renderWith();
    expect(screen.getByTestId("category-title")).toBeInTheDocument();
    expect(screen.getByTestId("smartphone-category")).toBeInTheDocument();
    expect(screen.getByTestId("accessories-category")).toBeInTheDocument();
    expect(screen.getByTestId("tablets-category")).toBeInTheDocument();
  });

  it("renders Featured section", () => {
    renderWith();
    expect(screen.getByTestId("featured-heading")).toBeInTheDocument();
  });
});
