import { describe, it, expect, vi, beforeEach } from "vitest";
import productReducer, {
  updateFilters,
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

const mockProduct = {
  id: 1,
  name: "Phone",
  description: "A phone",
  img: "img.jpg",
  price: 999,
  category: "smartphone",
  stock: 10,
};
const mockProduct2 = {
  id: 2,
  name: "Tablet",
  description: "A tablet",
  img: "tab.jpg",
  price: 599,
  category: "tablets",
  stock: 5,
};

const createStore = () =>
  configureStore({ reducer: { products: productReducer } });

describe("productSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateFilters", () => {
    it("merges new filters into state", () => {
      const state = productReducer(
        undefined,
        updateFilters({ category: "smartphone", page: 2 }),
      );
      expect(state.filters.category).toBe("smartphone");
      expect(state.filters.page).toBe(2);
    });
  });

  describe("fetchProducts", () => {
    it("sets products on success", async () => {
      const response = {
        products: [mockProduct],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      mockedService.getAll.mockResolvedValue(response);
      const store = createStore();

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.products).toEqual([mockProduct]);
      expect(state.loading).toBe(false);
      expect(state.pagination).toEqual(response.pagination);
    });

    it("sets error on failure", async () => {
      mockedService.getAll.mockRejectedValue(new Error("Network error"));
      const store = createStore();

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.error).toBe("Network error");
      expect(state.loading).toBe(false);
    });
  });

  describe("fetchProductById", () => {
    it("sets selectedProduct on success", async () => {
      mockedService.getById.mockResolvedValue(mockProduct);
      const store = createStore();

      await store.dispatch(fetchProductById(1));

      expect(store.getState().products.selectedProduct).toEqual(mockProduct);
    });

    it("sets error on failure", async () => {
      mockedService.getById.mockRejectedValue(new Error("Not found"));
      const store = createStore();

      await store.dispatch(fetchProductById(999));

      expect(store.getState().products.error).toBe("Not found");
    });
  });

  describe("createProduct", () => {
    it("adds product to list on success", async () => {
      mockedService.getAll.mockResolvedValue({
        products: [mockProduct],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
      mockedService.create.mockResolvedValue(mockProduct2);
      const store = createStore();

      await store.dispatch(fetchProducts());
      await store.dispatch(
        createProduct({
          name: "Tablet",
          description: "A tablet",
          img: "tab.jpg",
          price: 599,
          category: "tablets",
          stock: 5,
        }),
      );

      expect(store.getState().products.products).toHaveLength(2);
    });
  });

  describe("updateProduct", () => {
    it("updates product in list on success", async () => {
      mockedService.getAll.mockResolvedValue({
        products: [mockProduct],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
      const updated = { ...mockProduct, name: "Updated Phone" };
      mockedService.update.mockResolvedValue(updated);
      const store = createStore();

      await store.dispatch(fetchProducts());
      await store.dispatch(
        updateProduct({ id: 1, product: { name: "Updated Phone" } }),
      );

      expect(store.getState().products.products[0].name).toBe("Updated Phone");
    });

    it("updates selectedProduct if it matches", async () => {
      mockedService.getById.mockResolvedValue(mockProduct);
      const updated = { ...mockProduct, name: "Updated" };
      mockedService.update.mockResolvedValue(updated);
      const store = createStore();

      await store.dispatch(fetchProductById(1));
      await store.dispatch(
        updateProduct({ id: 1, product: { name: "Updated" } }),
      );

      expect(store.getState().products.selectedProduct?.name).toBe("Updated");
    });
  });

  describe("deleteProduct", () => {
    it("removes product from list", async () => {
      mockedService.getAll.mockResolvedValue({
        products: [mockProduct, mockProduct2],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
      });
      mockedService.delete.mockResolvedValue(1);
      const store = createStore();

      await store.dispatch(fetchProducts());
      await store.dispatch(deleteProduct(1));

      const state = store.getState().products;
      expect(state.products).toHaveLength(1);
      expect(state.products[0].id).toBe(2);
    });

    it("clears selectedProduct if it was deleted", async () => {
      mockedService.getById.mockResolvedValue(mockProduct);
      mockedService.delete.mockResolvedValue(1);
      const store = createStore();

      await store.dispatch(fetchProductById(1));
      await store.dispatch(deleteProduct(1));

      expect(store.getState().products.selectedProduct).toBeNull();
    });
  });
});
