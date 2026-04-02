import { describe, it, expect, vi, beforeEach } from "vitest";
import productReducer, {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/store/slices/productSlice";
import { configureStore } from "@reduxjs/toolkit";
import { productService } from "@/services/product.service";

vi.mock("@/services/product.service");
const mockedService = vi.mocked(productService, true);

const createStore = () => configureStore({ reducer: { products: productReducer } });

const mockProduct = { id: 1, name: "Phone", description: "A phone", img: "img.jpg", price: 999, category: "smartphone", stock: 10 };

describe("productSlice branches", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchProducts sets pending state", async () => {
    let resolve: (v: unknown) => void;
    mockedService.getAll.mockReturnValue(new Promise((r) => { resolve = r; }));
    const store = createStore();
    const p = store.dispatch(fetchProducts());
    expect(store.getState().products.loading).toBe(true);
    expect(store.getState().products.error).toBeNull();
    resolve!({ products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
    await p;
  });

  it("createProduct sets pending and handles rejection", async () => {
    mockedService.create.mockRejectedValue(new Error("Create failed"));
    const store = createStore();
    await store.dispatch(createProduct({ name: "X", description: "", img: "", price: 0, category: "", stock: 0 }));
    expect(store.getState().products.error).toBe("Create failed");
  });

  it("updateProduct sets pending and handles rejection", async () => {
    mockedService.update.mockRejectedValue(new Error("Update failed"));
    const store = createStore();
    await store.dispatch(updateProduct({ id: 1, product: { name: "Y" } }));
    expect(store.getState().products.error).toBe("Update failed");
  });

  it("deleteProduct sets pending and handles rejection", async () => {
    mockedService.delete.mockRejectedValue(new Error("Delete failed"));
    const store = createStore();
    await store.dispatch(deleteProduct(1));
    expect(store.getState().products.error).toBe("Delete failed");
  });

  it("updateProduct does nothing when product not in list", async () => {
    const updated = { ...mockProduct, id: 99, name: "Ghost" };
    mockedService.update.mockResolvedValue(updated);
    const store = createStore();
    await store.dispatch(updateProduct({ id: 99, product: { name: "Ghost" } }));
    expect(store.getState().products.products).toHaveLength(0);
  });

  it("deleteProduct does not clear selectedProduct if different id", async () => {
    mockedService.getById.mockResolvedValue(mockProduct);
    mockedService.delete.mockResolvedValue(99);
    const store = createStore();
    await store.dispatch(fetchProductById(1));
    await store.dispatch(deleteProduct(99));
    expect(store.getState().products.selectedProduct).toEqual(mockProduct);
  });

  it("fetchProducts uses error message fallback", async () => {
    mockedService.getAll.mockRejectedValue({ message: undefined });
    const store = createStore();
    await store.dispatch(fetchProducts());
    expect(store.getState().products.error).toBe("Failed to fetch products");
  });
});
