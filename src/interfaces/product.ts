import { SortOrder } from "../types/common";

export interface Product {
  id: number;
  name: string;
  description: string;
  img: string;
  price: number;
  category: string;
  stock: number;
}

export interface ProductFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  outOfStock?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}
