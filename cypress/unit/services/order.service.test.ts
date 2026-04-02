import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { orderService } from "@/services/order.service";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const mockOrder = {
  id: 1,
  userId: 1,
  items: [{ productId: 1, quantity: 2, price: 19.99 }],
  total: 39.98,
  paymentIntentId: "pi_123",
  status: "pending" as const,
  shippingAddress: { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" },
  createdAt: "2025-01-01T00:00:00Z",
};

describe("orderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("creates an order", async () => {
      mockedAxios.post.mockResolvedValue({ data: mockOrder });

      const payload = {
        items: mockOrder.items,
        totalAmount: mockOrder.total,
        paymentIntentId: "pi_123",
        status: "pending",
        shippingAddress: mockOrder.shippingAddress,
      };
      const result = await orderService.create(payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/orders"),
        payload,
        { withCredentials: true },
      );
      expect(result).toEqual(mockOrder);
    });
  });

  describe("getUserOrders", () => {
    it("fetches user orders", async () => {
      const response = { data: { orders: [mockOrder] } };
      mockedAxios.get.mockResolvedValue(response);

      const result = await orderService.getUserOrders();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/orders/my-orders"),
        { withCredentials: true },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("getAll", () => {
    it("fetches all orders with filters", async () => {
      const response = {
        data: {
          orders: [mockOrder],
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      };
      mockedAxios.get.mockResolvedValue(response);

      const filters = { page: 1, limit: 10, sortBy: "createdAt" as const, sortOrder: "desc" as const };
      const result = await orderService.getAll(filters);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/orders"),
        { params: filters, withCredentials: true },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("updateStatus", () => {
    it("updates order status", async () => {
      const updated = { ...mockOrder, status: "shipped" as const };
      mockedAxios.patch.mockResolvedValue({ data: updated });

      const result = await orderService.updateStatus(1, "shipped");

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/orders/1/status"),
        { status: "shipped" },
        { withCredentials: true },
      );
      expect(result.status).toBe("shipped");
    });
  });
});
