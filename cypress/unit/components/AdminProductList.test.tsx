import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductList from "@/components/admin/ProductList";

const mockProducts = [
  { id: 1, name: "Phone", description: "A phone", img: "/img.jpg", price: 999, category: "smartphone", stock: 10 },
  { id: 2, name: "Tablet", description: "A tablet", img: "/tab.jpg", price: 599, category: "tablets", stock: 5 },
];

describe("Admin ProductList", () => {
  it("renders product rows", async () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    const names = await screen.findAllByTestId("product-name");
    expect(names[0]).toHaveTextContent("Phone");
    expect(names[1]).toHaveTextContent("Tablet");
    const prices = await screen.findAllByTestId("product-price");
    expect(prices[0]).toHaveTextContent("$999.00");
  });

  it("renders column headers", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    expect(screen.getByTestId("th-id")).toBeInTheDocument();
    expect(screen.getByTestId("th-name")).toBeInTheDocument();
    expect(screen.getByTestId("th-category")).toBeInTheDocument();
    expect(screen.getByTestId("th-price")).toBeInTheDocument();
    expect(screen.getByTestId("th-stock")).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", async () => {
    const onDelete = vi.fn();
    render(<ProductList products={mockProducts} onDelete={onDelete} />);
    const deleteButtons = await screen.findAllByTestId("delete-product");
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onSort when sortable header clicked", () => {
    const onSort = vi.fn();
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={onSort} />);
    fireEvent.click(screen.getByTestId("th-name"));
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("shows sort icons for active sort", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={vi.fn()} sortBy="price" sortOrder="asc" />);
    expect(screen.getByTestId("th-price")).toBeInTheDocument();
  });

  it("shows desc sort icon", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={vi.fn()} sortBy="price" sortOrder="desc" />);
    expect(screen.getByTestId("th-price")).toBeInTheDocument();
  });

  it("renders without onSort", async () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    const names = await screen.findAllByTestId("product-name");
    expect(names[0]).toHaveTextContent("Phone");
  });
});
