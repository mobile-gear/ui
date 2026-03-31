import axios from "axios";
import { Product, ProductFilters, ProductsResponse } from "../interfaces/product";

const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  getAll: async (params: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await axios.get<ProductsResponse>(`${API_URL}/products`, { params });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await axios.get<Product>(`${API_URL}/products/${id}`);
    return data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const { data } = await axios.post<Product>(`${API_URL}/products`, product, {
      withCredentials: true,
    });
    return data;
  },

  update: async (id: number, product: Partial<Omit<Product, "id">>): Promise<Product> => {
    const { data } = await axios.put<Product>(`${API_URL}/products/${id}`, product, {
      withCredentials: true,
    });
    return data;
  },

  delete: async (id: number): Promise<number> => {
    await axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
    return id;
  },
};
