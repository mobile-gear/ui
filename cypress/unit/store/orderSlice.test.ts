import { describe, it, expect, vi, beforeEach } from "vitest";
import orderReducer, {
  updateFilters,
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  updateOrderStatus,
} from "@/store/slices/orderSlice";
import { configureStore } from "@reduxjs/toolkit";
import { orderService } from "@/services/order.service";

vi.mock("@/services/order.service");
const mockedService = vi.mocked(orderService, true);

const mockAddress = {
  street: "123 Main",
  city: "NY",
  state: "NY",
  zipCode: "10001",
  country: "US",
};
const mockOrder = {
  id: 1,
  userId: 1,
  items: [{ productId: 1, quantity: 2, price: 19.99 }],
  total: 39.98,
  paymentIntentId: "pi_123",
  status: "pending" as const,
  shippingAddress: mockAddress,
  createdAt: "2025-01-01T00:00:00Z",
};

const createStore = () => configureStore({ reducer: { orders: orderReducer } });

describe("orderSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateFilters", () => {
    it("merges filters", () => {
      const state = orderReducer(
        undefined,
        updateFilters({ status: "shipped" }),
      );
      expect(state.filters.status).toBe("shipped");
    });
  });

  describe("createOrder", () => {
    it("adds order on success", async () => {
      mockedService.create.mockResolvedValue(mockOrder);
      const store = createStore();

      await store.dispatch(
        createOrder({
          items: mockOrder.items,
          totalAmount: mockOrder.total,
          paymentIntentId: "pi_123",
          status: "pending",
          shippingAddress: mockAddress,
        }),
      );

      const state = store.getState().orders;
      expect(state.orders).toHaveLength(1);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.isLoading).toBe(false);
    });

    it("sets error on failure", async () => {
      mockedService.create.mockRejectedValue(new Error("fail"));
      const store = createStore();

      await store.dispatch(
        createOrder({
          items: [],
          totalAmount: 0,
          paymentIntentId: "pi_bad",
          status: "pending",
          shippingAddress: mockAddress,
        }),
      );

      expect(store.getState().orders.error).toBeTruthy();
    });
  });

  describe("fetchUserOrders", () => {
    it("sets orders on success", async () => {
      mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder] });
      const store = createStore();

      await store.dispatch(fetchUserOrders());

      expect(store.getState().orders.orders).toEqual([mockOrder]);
    });
  });

  describe("fetchAllOrders", () => {
    it("sets orders and pagination on success", async () => {
      const response = {
        orders: [mockOrder],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockedService.getAll.mockResolvedValue(response);
      const store = createStore();

      await store.dispatch(fetchAllOrders());

      const state = store.getState().orders;
      expect(state.orders).toEqual([mockOrder]);
      expect(state.pagination).toEqual(response.pagination);
    });
  });

  describe("updateOrderStatus", () => {
    it("updates order status in list", async () => {
      const updated = { ...mockOrder, status: "shipped" as const };
      mockedService.getAll.mockResolvedValue({
        orders: [mockOrder],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
      mockedService.updateStatus.mockResolvedValue(updated);
      const store = createStore();

      await store.dispatch(fetchAllOrders());
      await store.dispatch(
        updateOrderStatus({ orderId: 1, status: "shipped" }),
      );

      expect(store.getState().orders.orders[0].status).toBe("shipped");
    });
  });
});
