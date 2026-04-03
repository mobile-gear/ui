import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import productReducer from "@/store/slices/productSlice";
import FeaturedProducts from "@/components/FeaturedProducts";

vi.mock("react-multi-carousel", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockProducts = [
  { id: 1, name: "Phone", description: "A phone", img: "/img.jpg", price: 999, category: "smartphone", stock: 10 },
  { id: 2, name: "Tablet", description: "A tablet", img: "/tab.jpg", price: 599, category: "tablets", stock: 5 },
];

const createStore = (overrides = {}) =>
  configureStore({
    reducer: { products: productReducer },
    preloadedState: {
      products: {
        products: mockProducts,
        loading: false,
        error: null,
        pagination: null,
        selectedProduct: null,
        filters: { searchTerm: "", page: 1 },
        ...overrides,
      },
    },
  });

const renderWith = (overrides = {}) =>
  render(
    <Provider store={createStore(overrides)}>
      <MemoryRouter>
        <FeaturedProducts />
      </MemoryRouter>
    </Provider>,
  );

describe("FeaturedProducts", () => {
  it("renders product names", async () => {
    renderWith();
    const names = await screen.findAllByTestId("featured-product");
    expect(names[0]).toHaveTextContent("Phone");
    expect(names[1]).toHaveTextContent("Tablet");
  });

  it("renders product prices", async () => {
    renderWith();
    const prices = await screen.findAllByTestId("featured-price");
    expect(prices[0]).toHaveTextContent("$999.00");
    expect(prices[1]).toHaveTextContent("$599.00");
  });

  it("renders product images", async () => {
    renderWith();
    const imgs = await screen.findAllByTestId("featured-img");
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute("alt", "Phone");
  });

  it("renders View Details links", async () => {
    renderWith();
    const links = await screen.findAllByTestId("featured-link");
    expect(links).toHaveLength(2);
  });

  it("shows spinner when loading", () => {
    renderWith({ loading: true });
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows error message", () => {
    renderWith({ error: "Failed to load" });
    expect(screen.getByTestId("featured-error")).toHaveTextContent("Failed to load");
  });
});
