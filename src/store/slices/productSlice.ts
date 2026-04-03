import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Product,
  ProductFilters,
  PaginationData,
} from "../../interfaces/product";
import { productService } from "../../services/product.service";

interface ProductState {
  products: Product[];
  error: string | null;
  loading: boolean;
  pagination: PaginationData | null;
  selectedProduct: Product | null;
  filters: ProductFilters;
}

const initialState: ProductState = {
  products: [],
  error: null,
  loading: false,
  pagination: null,
  selectedProduct: null,
  filters: {
    searchTerm: "",
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    page: 1,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const state = getState() as { products: ProductState };
    return productService.getAll(state.products.filters);
  },
);

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchProductById",
  async (id) => productService.getById(id),
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Omit<Product, "id">) => productService.create(product),
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({
    id,
    product,
  }: {
    id: number;
    product: Partial<Omit<Product, "id">>;
  }) => productService.update(id, product),
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => productService.delete(id),
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      });
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      });
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.products[index] = action.payload;
        if (state.selectedProduct?.id === action.payload.id)
          state.selectedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      });
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload)
          state.selectedProduct = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export type { Product };
export const { updateFilters } = productSlice.actions;
export default productSlice.reducer;
