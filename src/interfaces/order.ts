import { SortOrder } from "../types/common";
import { ShippingAddress } from "./checkout";
import { Product } from "./product";

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  paymentIntentId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  totalAmount: number;
  paymentIntentId: string;
  status: string;
  shippingAddress: ShippingAddress;
}

export interface OrderFilters {
  status?: string;
  minTotal?: number;
  maxTotal?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "id" | "createdAt" | "status" | "total";
  sortOrder?: SortOrder;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationData;
}
