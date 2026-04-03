import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import orderReducer from "@/store/slices/orderSlice";
import OrderHistory from "@/pages/OrderHistory";
import { orderService } from "@/services/order.service";

vi.mock("@/services/order.service");
const mockedService = vi.mocked(orderService, true);

const mockOrder = {
  id: 1,
  userId: 1,
  items: [{ productId: 1, quantity: 2, price: 19.99, product: { id: 1, name: "Phone", description: "", img: "", price: 19.99, category: "smartphone", stock: 10 } }],
  total: 39.98,
  paymentIntentId: "pi_123",
  status: "delivered" as const,
  shippingAddress: { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" },
  createdAt: "2025-01-15T10:00:00Z",
};

const defaultFilters = {
  page: 1,
  limit: 10,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

const createStore = (overrides: Record<string, unknown> = {}) =>
  configureStore({
    reducer: { orders: orderReducer },
    preloadedState: {
      orders: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null,
        pagination: null,
        filters: defaultFilters,
        ...overrides,
      },
    },
  });

describe("OrderHistory", () => {
  it("shows loading spinner", () => {
    mockedService.getUserOrders.mockReturnValue(new Promise(() => {}));
    render(
      <Provider store={createStore({ isLoading: true })}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows error message", async () => {
    mockedService.getUserOrders.mockRejectedValue(new Error("Failed to load"));
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Failed to fetch orders")).toBeInTheDocument();
  });

  it("shows empty state when no orders", async () => {
    mockedService.getUserOrders.mockResolvedValue({ orders: [] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("No orders yet.")).toBeInTheDocument();
  });

  it("renders order heading", async () => {
    mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Order History")).toBeInTheDocument();
  });

  it("renders order details", async () => {
    mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Order #1")).toBeInTheDocument();
    expect(screen.getAllByText("$39.98").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("order-status-delivered")).toBeInTheDocument();
  });

  it("renders shipping address", async () => {
    mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("123 Main")).toBeInTheDocument();
  });

  it("renders item with product name", async () => {
    mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText(/Phone/)).toBeInTheDocument();
  });

  it("renders item without product name using productId fallback", async () => {
    const orderWithoutProductName = {
      ...mockOrder,
      items: [{ productId: 5, quantity: 1, price: 9.99 }],
    };
    mockedService.getUserOrders.mockResolvedValue({ orders: [orderWithoutProductName] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText(/Product #5/)).toBeInTheDocument();
  });

  it("applies correct status styles for different statuses", async () => {
    const pendingOrder = { ...mockOrder, id: 2, status: "pending" as const };
    const cancelledOrder = { ...mockOrder, id: 3, status: "cancelled" as const };
    mockedService.getUserOrders.mockResolvedValue({ orders: [mockOrder, pendingOrder, cancelledOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Delivered")).toBeInTheDocument();
    expect(screen.getByTestId("order-status-pending")).toBeInTheDocument();
    expect(screen.getByTestId("order-status-cancelled")).toBeInTheDocument();
  });

  it("uses fallback style for unknown status", async () => {
    const unknownOrder = { ...mockOrder, id: 4, status: "unknown" as "pending" };
    mockedService.getUserOrders.mockResolvedValue({ orders: [unknownOrder] });
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <OrderHistory />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("Unknown")).toBeInTheDocument();
  });
});
