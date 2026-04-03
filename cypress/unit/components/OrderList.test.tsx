import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OrderList from "@/components/OrderList";

const mockOrders = [
  {
    id: 1,
    userId: 1,
    items: [{ productId: 1, quantity: 2, price: 19.99 }],
    total: 39.98,
    paymentIntentId: "pi_123",
    status: "pending" as const,
    shippingAddress: {
      street: "123 Main",
      city: "NY",
      state: "NY",
      zipCode: "10001",
      country: "US",
    },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    items: [{ productId: 2, quantity: 1, price: 9.99 }],
    total: 9.99,
    paymentIntentId: "pi_456",
    status: "delivered" as const,
    shippingAddress: {
      street: "456 Oak",
      city: "LA",
      state: "CA",
      zipCode: "90001",
      country: "US",
    },
    createdAt: "2025-02-20T14:00:00Z",
  },
];

describe("OrderList", () => {
  it("renders order rows", async () => {
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={vi.fn()}
      />,
    );
    const orderIds = await screen.findAllByTestId("order-number-short");
    expect(orderIds[0]).toHaveTextContent("#1");
    expect(orderIds[1]).toHaveTextContent("#2");
    const orderTotals = await screen.findAllByTestId("order-total");
    expect(orderTotals[0]).toHaveTextContent("$39.98");
  });

  it("renders column headers", () => {
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={vi.fn()}
      />,
    );
    expect(screen.getByTestId("th-id")).toBeInTheDocument();
    expect(screen.getByTestId("th-createdAt")).toBeInTheDocument();
    expect(screen.getByTestId("th-status")).toBeInTheDocument();
    expect(screen.getByTestId("sort-total")).toBeInTheDocument();
  });

  it("calls onSort when column header is clicked", () => {
    const onSort = vi.fn();
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByTestId("th-id"));
    expect(onSort).toHaveBeenCalledWith("id");
  });

  it("calls onStatusChange when select changes", async () => {
    const onStatusChange = vi.fn();
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={onStatusChange}
        onSort={vi.fn()}
      />,
    );
    const selects = await screen.findAllByTestId("order-select");
    fireEvent.change(selects[0], { target: { value: "shipped" } });
    expect(onStatusChange).toHaveBeenCalledWith(1, "shipped");
  });

  it("shows sort icons for active sort", () => {
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={vi.fn()}
        sortBy="total"
        sortOrder="asc"
      />,
    );
    expect(screen.getByTestId("sort-total")).toBeInTheDocument();
  });

  it("shows desc sort icon", () => {
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={vi.fn()}
        sortBy="total"
        sortOrder="desc"
      />,
    );
    expect(screen.getByTestId("sort-total")).toBeInTheDocument();
  });

  it("applies fallback style for unknown status", () => {
    const unknownStatusOrder = {
      ...mockOrders[0],
      id: 3,
      status: "unknown" as "pending",
    };
    render(
      <OrderList
        orders={[unknownStatusOrder]}
        onStatusChange={vi.fn()}
        onSort={vi.fn()}
      />,
    );
    expect(screen.getByTestId("order-status-unknown")).toHaveTextContent(
      "unknown",
    );
  });

  it("applies correct style for each known status", () => {
    const statuses = [
      "delivered",
      "processing",
      "shipped",
      "cancelled",
      "pending",
    ] as const;
    const orders = statuses.map((status, i) => ({
      ...mockOrders[0],
      id: i + 10,
      status,
    }));
    render(
      <OrderList orders={orders} onStatusChange={vi.fn()} onSort={vi.fn()} />,
    );
    statuses.forEach((s) =>
      expect(screen.getByTestId(`order-status-${s}`)).toHaveTextContent(s),
    );
  });

  it("calls onSort for different columns", () => {
    const onSort = vi.fn();
    render(
      <OrderList
        orders={mockOrders}
        onStatusChange={vi.fn()}
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByTestId("th-createdAt"));
    expect(onSort).toHaveBeenCalledWith("createdAt");
    fireEvent.click(screen.getByTestId("th-status"));
    expect(onSort).toHaveBeenCalledWith("status");
    fireEvent.click(screen.getByTestId("sort-total"));
    expect(onSort).toHaveBeenCalledWith("total");
  });
});
