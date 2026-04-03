import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
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
  it("renders product cards", async () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    const names = await screen.findAllByTestId("product-name");
    expect(names[0]).toHaveTextContent("Phone Case");
    expect(names[1]).toHaveTextContent("Charger");
  });

  it("shows spinner when loading", () => {
    renderWith({ products: [], error: null, loading: true });
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows error message", () => {
    renderWith({ products: [], error: "Something went wrong", loading: false });
    expect(screen.getByTestId("product-list-error")).toHaveTextContent("Something went wrong");
  });

  it("shows empty message when no products", () => {
    renderWith({ products: [], error: null, loading: false });
    expect(screen.getByTestId("product-list-empty")).toBeInTheDocument();
  });

  it("dispatches addToCart on button click", async () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    const buttons = await screen.findAllByTestId("add-to-cart");
    fireEvent.click(buttons[0]);
  });

  it("renders prices", async () => {
    renderWith({ products: mockProducts, error: null, loading: false });
    const prices = await screen.findAllByTestId("product-price");
    expect(prices[0]).toHaveTextContent("$19.99");
    expect(prices[1]).toHaveTextContent("$29.99");
  });
});
