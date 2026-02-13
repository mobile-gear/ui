import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getHeaders from "../../utils/getHeaders";

export interface Product {
  id: number;
  name: string;
  description: string;
  img: string;
  price: number;
  category: string;
  stock: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  outOfStock?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

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
    const { filters: params } = state.products;

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/products`,
      { params },
    );
    return data;
  },
);

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchProductById",
  async (id: number) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
    );
    return response.data;
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Omit<Product, "id">) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/products`,
      product,
      getHeaders(),
    );
    return response.data;
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({
    id,
    product,
  }: {
    id: number;
    product: Partial<Omit<Product, "id">>;
  }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      product,
      getHeaders(),
    );
    return response.data;
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/products/${id}`,
      getHeaders(),
    );
    return id;
  },
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
        state.products = action.payload.products;
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
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
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
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { updateFilters } = productSlice.actions;
export default productSlice.reducer;
