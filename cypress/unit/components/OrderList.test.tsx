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
    shippingAddress: { street: "123 Main", city: "NY", state: "NY", zipCode: "10001", country: "US" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    items: [{ productId: 2, quantity: 1, price: 9.99 }],
    total: 9.99,
    paymentIntentId: "pi_456",
    status: "delivered" as const,
    shippingAddress: { street: "456 Oak", city: "LA", state: "CA", zipCode: "90001", country: "US" },
    createdAt: "2025-02-20T14:00:00Z",
  },
];

describe("OrderList", () => {
  it("renders order rows", () => {
    render(
      <OrderList orders={mockOrders} onStatusChange={vi.fn()} onSort={vi.fn()} />,
    );
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("$39.98")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <OrderList orders={mockOrders} onStatusChange={vi.fn()} onSort={vi.fn()} />,
    );
    expect(screen.getByText(/Order ID/)).toBeInTheDocument();
    expect(screen.getByText(/Date/)).toBeInTheDocument();
    expect(screen.getByText(/Status/)).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();
  });

  it("calls onSort when column header is clicked", () => {
    const onSort = vi.fn();
    render(
      <OrderList orders={mockOrders} onStatusChange={vi.fn()} onSort={onSort} />,
    );
    fireEvent.click(screen.getByText(/Order ID/));
    expect(onSort).toHaveBeenCalledWith("id");
  });

  it("calls onStatusChange when select changes", () => {
    const onStatusChange = vi.fn();
    render(
      <OrderList orders={mockOrders} onStatusChange={onStatusChange} onSort={vi.fn()} />,
    );
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "shipped" } });
    expect(onStatusChange).toHaveBeenCalledWith(1, "shipped");
  });

  it("shows sort icons for active sort", () => {
    render(
      <OrderList orders={mockOrders} onStatusChange={vi.fn()} onSort={vi.fn()} sortBy="total" sortOrder="asc" />,
    );
    expect(screen.getByText(/Total/)).toBeInTheDocument();
  });

  it("shows desc sort icon", () => {
    render(
      <OrderList orders={mockOrders} onStatusChange={vi.fn()} onSort={vi.fn()} sortBy="total" sortOrder="desc" />,
    );
    expect(screen.getByText(/Total/)).toBeInTheDocument();
  });
});
