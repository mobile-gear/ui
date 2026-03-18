import axios from "axios";
import { Order, CreateOrderPayload, OrderFilters, OrdersResponse } from "../interfaces/order";
import getHeaders from "../utils/getHeaders";

const API_URL = import.meta.env.VITE_API_URL;

export const orderService = {
  create: async (orderData: CreateOrderPayload): Promise<Order> => {
    const { data } = await axios.post<Order>(`${API_URL}/orders`, orderData, getHeaders());
    return data;
  },

  getUserOrders: async (): Promise<{ orders: Order[] }> => {
    const { data } = await axios.get<{ orders: Order[] }>(`${API_URL}/orders/my-orders`, getHeaders());
    return data;
  },

  getAll: async (params: OrderFilters): Promise<OrdersResponse> => {
    const { data } = await axios.get<OrdersResponse>(`${API_URL}/orders`, {
      params,
      ...getHeaders(),
    });
    return data;
  },

  updateStatus: async (orderId: number, status: Order["status"]): Promise<Order> => {
    const { data } = await axios.patch<Order>(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      getHeaders(),
    );
    return data;
  },
};
