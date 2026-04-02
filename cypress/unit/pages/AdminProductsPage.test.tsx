import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import productReducer from "@/store/slices/productSlice";
import ProductsPage from "@/pages/admin/ProductsPage";
import { productService } from "@/services/product.service";

vi.mock("@/services/product.service");
const mockedService = vi.mocked(productService, true);

const mockProduct = { id: 1, name: "Phone", description: "A phone", img: "/img.jpg", price: 999, category: "smartphone", stock: 10 };

const createStore = (overrides = {}) =>
  configureStore({
    reducer: { products: productReducer },
    preloadedState: {
      products: {
        products: [mockProduct],
        loading: false,
        error: null,
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        selectedProduct: null,
        filters: { searchTerm: "", page: 1 },
        ...overrides,
      },
    },
  });

const renderWith = (overrides = {}) => {
  mockedService.getAll.mockResolvedValue({
    products: [mockProduct],
    pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
  });
  return render(
    <Provider store={createStore(overrides)}>
      <MemoryRouter initialEntries={["/admin/products"]}>
        <ProductsPage />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Admin ProductsPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders page heading", () => {
    renderWith();
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
  });

  it("renders the add product form", () => {
    renderWith();
    expect(screen.getByText("Add New Product")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
  });

  it("shows error state after fetch failure", async () => {
    mockedService.getAll.mockRejectedValue(new Error("Server error"));
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/admin/products"]}>
          <ProductsPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  it("fills and submits the new product form", async () => {
    mockedService.create.mockResolvedValue({ ...mockProduct, id: 2, name: "Tablet" });
    renderWith();

    fireEvent.change(document.querySelector("input[name='name']")!, { target: { value: "Tablet" } });
    fireEvent.change(document.querySelector("input[name='price']")!, { target: { value: "599" } });
    fireEvent.change(document.querySelector("input[name='stock']")!, { target: { value: "5" } });
    fireEvent.change(document.querySelector("textarea[name='description']")!, { target: { value: "A tablet" } });

    fireEvent.submit(screen.getByText("Add Product").closest("form")!);

    await waitFor(() => {
      expect(mockedService.create).toHaveBeenCalled();
    });
  });

  it("handles filter change", () => {
    renderWith();
    const selects = screen.getAllByRole("combobox");
    const filterSelect = selects.find((s) => !s.closest("form"));
    if (filterSelect) {
      fireEvent.change(filterSelect, { target: { value: "smartphone", name: "category" } });
    }
  });

  it("handles input change for numeric fields", () => {
    renderWith();
    const priceInput = document.querySelector("input[name='price']");
    if (priceInput) {
      fireEvent.change(priceInput, { target: { value: "123", name: "price" } });
    }
    const stockInput = document.querySelector("input[name='stock']");
    if (stockInput) {
      fireEvent.change(stockInput, { target: { value: "5", name: "stock" } });
    }
  });
});
