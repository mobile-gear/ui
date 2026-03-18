import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  Order,
  CreateOrderPayload,
  OrderFilters,
  OrdersResponse,
  PaginationData,
} from "../../interfaces/order";
import { orderService } from "../../services/order.service";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData | null;
  filters: OrderFilters;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    status: undefined,
    minTotal: undefined,
    maxTotal: undefined,
    startDate: undefined,
    endDate: undefined,
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: CreateOrderPayload, { rejectWithValue }) => {
    try {
      return await orderService.create(orderData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to create order");
      }
      return rejectWithValue("Failed to create order");
    }
  },
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getUserOrders();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
      }
      return rejectWithValue("Failed to fetch orders");
    }
  },
);

export const fetchAllOrders = createAsyncThunk<OrdersResponse>(
  "orders/fetchAllOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { orders: OrderState };
      return await orderService.getAll(state.orders.filters);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || "Failed to fetch orders");
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }: { orderId: number; status: Order["status"] }, { rejectWithValue }) => {
    try {
      return await orderService.updateStatus(orderId, status);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || "Failed to update order status");
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export type { Order };
export const { updateFilters } = orderSlice.actions;
export default orderSlice.reducer;
