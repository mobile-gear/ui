import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import orderReducer from "@/store/slices/orderSlice";
import OrdersPage from "@/pages/admin/OrdersPage";
import { orderService } from "@/services/order.service";

vi.mock("@/services/order.service");
const mockedService = vi.mocked(orderService, true);

const mockOrder = {
  id: 1,
  userId: 1,
  items: [{ productId: 1, quantity: 2, price: 19.99 }],
  total: 39.98,
  paymentIntentId: "pi_123",
  status: "pending" as const,
  shippingAddress: { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" },
  createdAt: "2025-01-15T10:00:00Z",
};

const defaultFilters = {
  page: 1,
  limit: 10,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

const mockResponse = { orders: [mockOrder], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } };

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

describe("Admin OrdersPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders orders heading", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByRole("heading", { name: "Orders" })).toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    mockedService.getAll.mockRejectedValue({ response: { data: { message: "Server error" } } });
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("An unknown error occurred")).toBeInTheDocument();
  });

  it("renders order list with order data", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(screen.getByTestId("order-total")).toBeInTheDocument();
  });

  it("handles status filter change", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    const statusFilter = screen.getByDisplayValue("All Orders");
    fireEvent.change(statusFilter, { target: { value: "pending" } });
    expect(store.getState().orders.filters.status).toBe("pending");
  });

  it("clears status filter when empty value selected", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore({ filters: { ...defaultFilters, status: "shipped" } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    const statusFilter = screen.getByDisplayValue("Shipped");
    fireEvent.change(statusFilter, { target: { value: "" } });
    expect(store.getState().orders.filters.status).toBeUndefined();
  });

  it("handles min total filter change", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    const minInput = screen.getByPlaceholderText("Min $");
    fireEvent.change(minInput, { target: { value: "10", name: "minTotal" } });
    expect(store.getState().orders.filters.minTotal).toBe(10);
  });

  it("clears total filter when empty", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore({ filters: { ...defaultFilters, minTotal: 10 } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    const minInput = screen.getByPlaceholderText("Min $");
    fireEvent.change(minInput, { target: { value: "", name: "minTotal" } });
    expect(store.getState().orders.filters.minTotal).toBeUndefined();
  });

  it("toggles sort order on column click", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    fireEvent.click(screen.getByTestId("sort-total"));
    expect(store.getState().orders.filters.sortBy).toBe("total");
    expect(store.getState().orders.filters.sortOrder).toBe("asc");
  });

  it("toggles to desc when clicking same column", async () => {
    mockedService.getAll.mockResolvedValue(mockResponse);
    const store = createStore({ filters: { ...defaultFilters, sortBy: "total", sortOrder: "asc" } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/admin/orders"]}>
          <OrdersPage />
        </MemoryRouter>
      </Provider>,
    );
    await screen.findByText("#1");
    fireEvent.click(screen.getByTestId("sort-total"));
    expect(store.getState().orders.filters.sortOrder).toBe("desc");
  });
});
