import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import productReducer from "@/store/slices/productSlice";
import cartReducer from "@/store/slices/cartSlice";
import ProductDetail from "@/pages/ProductDetail";
import { Product } from "@/interfaces/product";
import { productService } from "@/services/product.service";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => ({ id: "1" }) };
});

vi.mock("@/services/product.service");
const mockedService = vi.mocked(productService, true);

const baseProduct: Product = {
  id: 1,
  name: "Phone X",
  description: "A premium phone",
  img: "/phone.jpg",
  price: 999,
  category: "smartphone",
  stock: 15,
};

const createStore = (overrides: Partial<{ loading: boolean; error: string | null; selectedProduct: Product | null }> = {}) =>
  configureStore({
    reducer: { products: productReducer, cart: cartReducer },
    preloadedState: {
      products: {
        products: [],
        loading: false,
        error: null,
        pagination: null,
        selectedProduct: baseProduct,
        filters: { searchTerm: "", page: 1 },
        ...overrides,
      },
      cart: { items: [], totalItems: 0, totalPrice: 0 },
    },
  });

describe("ProductDetail", () => {
  it("shows spinner when loading", () => {
    mockedService.getById.mockReturnValue(new Promise(() => {}));
    render(
      <Provider store={createStore({ loading: true, selectedProduct: null })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message", async () => {
    mockedService.getById.mockRejectedValue(new Error("Not found"));
    render(
      <Provider store={createStore({ error: null, selectedProduct: null })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Not found")).toBeInTheDocument();
  });

  it("shows product not found when no product and not loading", async () => {
    mockedService.getById.mockResolvedValue(null as unknown as Product);
    render(
      <Provider store={createStore({ selectedProduct: null })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Product not found.")).toBeInTheDocument();
  });

  it("shows 'in stock' for stock > 10", async () => {
    const product = { ...baseProduct, stock: 15 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("15 in stock")).toBeInTheDocument();
  });

  it("shows 'Only X left' for stock between 1 and 10", async () => {
    const product = { ...baseProduct, stock: 5 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Only 5 left")).toBeInTheDocument();
  });

  it("shows 'Out of stock' and disables button when stock is 0", async () => {
    const product = { ...baseProduct, stock: 0 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Out of stock")).toBeInTheDocument();
    expect(screen.getByTestId("out-of-stock-btn")).toBeDisabled();
  });

  it("renders product details", async () => {
    mockedService.getById.mockResolvedValue(baseProduct);
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Phone X")).toBeInTheDocument();
    expect(screen.getByText("$999.00")).toBeInTheDocument();
    expect(screen.getByText("smartphone")).toBeInTheDocument();
  });

  it("increments and decrements quantity", async () => {
    const product = { ...baseProduct, stock: 10 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    const input = await screen.findByDisplayValue("1");
    fireEvent.click(screen.getByTestId("quantity-increment"));
    expect(input).toHaveValue(2);
    fireEvent.click(screen.getByTestId("quantity-decrement"));
    expect(input).toHaveValue(1);
  });

  it("does not decrement below 1", async () => {
    const product = { ...baseProduct, stock: 10 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    const input = await screen.findByDisplayValue("1");
    fireEvent.click(screen.getByTestId("quantity-decrement"));
    expect(input).toHaveValue(1);
  });

  it("handles manual quantity input", async () => {
    const product = { ...baseProduct, stock: 10 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    const input = await screen.findByDisplayValue("1");
    fireEvent.change(input, { target: { value: "3" } });
    expect(input).toHaveValue(3);
  });

  it("clamps invalid manual input to 1", async () => {
    const product = { ...baseProduct, stock: 10 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    const input = await screen.findByDisplayValue("1");
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue(1);
  });

  it("hides quantity controls when out of stock", async () => {
    const product = { ...baseProduct, stock: 0 };
    mockedService.getById.mockResolvedValue(product);
    render(
      <Provider store={createStore({ selectedProduct: product })}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("Out of stock");
    expect(screen.queryByTestId("quantity-increment")).not.toBeInTheDocument();
    expect(screen.queryByTestId("quantity-decrement")).not.toBeInTheDocument();
  });

  it("dispatches addToCart on click", async () => {
    mockedService.getById.mockResolvedValue(baseProduct);
    const store = createStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>
      </Provider>,
    );
    fireEvent.click(await screen.findByText("Add to Cart"));
    expect(store.getState().cart.items).toHaveLength(1);
  });
});
