import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/slices/cartSlice";
import ProductList from "@/components/ProductList";

const mockProducts = [
  { id: 1, name: "Phone Case", description: "Protective case", img: "/case.jpg", price: 19.99, category: "accessories", stock: 50 },
  { id: 2, name: "Charger", description: "Fast charger", img: "/charger.jpg", price: 29.99, category: "accessories", stock: 30 },
];

const renderWith = (props: { products: typeof mockProducts; error: string | null; loading: boolean }) => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductList {...props} />
      </MemoryRouter>
    </Provider>,
  );
};

describe("ProductList", () => {
  it("renders product cards", () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    expect(screen.getByText("Phone Case")).toBeInTheDocument();
    expect(screen.getByText("Charger")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    renderWith({ products: [], error: null, loading: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message", () => {
    renderWith({ products: [], error: "Something went wrong", loading: false });
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows empty message when no products", () => {
    renderWith({ products: [], error: null, loading: false });
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  it("dispatches addToCart on button click", () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    fireEvent.click(screen.getAllByText("Add to cart")[0]);
  });

  it("renders prices", () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });
});
