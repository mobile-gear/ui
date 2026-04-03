import { describe, it, expect, vi, beforeEach } from "vitest";
import orderReducer, {
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  updateOrderStatus,
} from "@/store/slices/orderSlice";
import { configureStore } from "@reduxjs/toolkit";
import { orderService } from "@/services/order.service";
import { AxiosError, AxiosHeaders } from "axios";

vi.mock("@/services/order.service");
const mockedService = vi.mocked(orderService, true);

const createStore = () => configureStore({ reducer: { orders: orderReducer } });

const mockAddress = {
  street: "123 Main",
  city: "NY",
  state: "NY",
  zipCode: "10001",
  country: "US",
};

const makeAxiosError = (message: string) =>
  new AxiosError("fail", "ERR", undefined, undefined, {
    data: { message },
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("orderSlice branch coverage", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("createOrder", () => {
    it("handles AxiosError rejection", async () => {
      mockedService.create.mockRejectedValue(makeAxiosError("Order failed"));
      const store = createStore();
      await store.dispatch(
        createOrder({
          items: [],
          totalAmount: 0,
          paymentIntentId: "pi_x",
          status: "pending",
          shippingAddress: mockAddress,
        }),
      );
      expect(store.getState().orders.error).toBe("Order failed");
    });

    it("sets pending state", async () => {
      let resolve: (v: unknown) => void;
      mockedService.create.mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      );
      const store = createStore();
      const p = store.dispatch(
        createOrder({
          items: [],
          totalAmount: 0,
          paymentIntentId: "pi_x",
          status: "pending",
          shippingAddress: mockAddress,
        }),
      );
      expect(store.getState().orders.isLoading).toBe(true);
      expect(store.getState().orders.error).toBeNull();
      resolve!({
        id: 1,
        userId: 1,
        items: [],
        total: 0,
        paymentIntentId: "pi_x",
        status: "pending",
        shippingAddress: mockAddress,
        createdAt: "",
      });
      await p;
    });
  });

  describe("fetchUserOrders", () => {
    it("handles AxiosError rejection", async () => {
      mockedService.getUserOrders.mockRejectedValue(
        makeAxiosError("Fetch failed"),
      );
      const store = createStore();
      await store.dispatch(fetchUserOrders());
      expect(store.getState().orders.error).toBe("Fetch failed");
    });

    it("handles non-Axios error rejection", async () => {
      mockedService.getUserOrders.mockRejectedValue(new Error("unknown"));
      const store = createStore();
      await store.dispatch(fetchUserOrders());
      expect(store.getState().orders.error).toBe("Failed to fetch orders");
    });

    it("sets pending state", async () => {
      let resolve: (v: unknown) => void;
      mockedService.getUserOrders.mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      );
      const store = createStore();
      const p = store.dispatch(fetchUserOrders());
      expect(store.getState().orders.isLoading).toBe(true);
      resolve!({ orders: [] });
      await p;
    });
  });

  describe("fetchAllOrders", () => {
    it("handles AxiosError rejection", async () => {
      mockedService.getAll.mockRejectedValue(makeAxiosError("All failed"));
      const store = createStore();
      await store.dispatch(fetchAllOrders());
      expect(store.getState().orders.error).toBe("All failed");
    });

    it("handles non-Axios error rejection", async () => {
      mockedService.getAll.mockRejectedValue(new Error("unknown"));
      const store = createStore();
      await store.dispatch(fetchAllOrders());
      expect(store.getState().orders.error).toBe("An unknown error occurred");
    });
  });

  describe("updateOrderStatus", () => {
    it("handles AxiosError rejection", async () => {
      mockedService.updateStatus.mockRejectedValue(
        makeAxiosError("Update failed"),
      );
      const store = createStore();
      await store.dispatch(
        updateOrderStatus({ orderId: 1, status: "shipped" }),
      );
      expect(store.getState().orders.error).toBe("Update failed");
    });

    it("handles non-Axios error rejection", async () => {
      mockedService.updateStatus.mockRejectedValue(new Error("unknown"));
      const store = createStore();
      await store.dispatch(
        updateOrderStatus({ orderId: 1, status: "shipped" }),
      );
      expect(store.getState().orders.error).toBe("An unknown error occurred");
    });

    it("handles update for non-existent order", async () => {
      const mockOrder = {
        id: 99,
        userId: 1,
        items: [],
        total: 0,
        paymentIntentId: "pi",
        status: "shipped" as const,
        shippingAddress: mockAddress,
        createdAt: "",
      };
      mockedService.updateStatus.mockResolvedValue(mockOrder);
      const store = createStore();
      await store.dispatch(
        updateOrderStatus({ orderId: 99, status: "shipped" }),
      );
      expect(store.getState().orders.orders).toHaveLength(0);
    });
  });
});
