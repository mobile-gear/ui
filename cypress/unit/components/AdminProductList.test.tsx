import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductList from "@/components/admin/ProductList";

const mockProducts = [
  { id: 1, name: "Phone", description: "A phone", img: "/img.jpg", price: 999, category: "smartphone", stock: 10 },
  { id: 2, name: "Tablet", description: "A tablet", img: "/tab.jpg", price: 599, category: "tablets", stock: 5 },
];

describe("Admin ProductList", () => {
  it("renders product rows", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();
    expect(screen.getByText("$999.00")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", () => {
    const onDelete = vi.fn();
    render(<ProductList products={mockProducts} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onSort when sortable header clicked", () => {
    const onSort = vi.fn();
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={onSort} />);
    fireEvent.click(screen.getByText("Name"));
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("shows sort icons for active sort", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={vi.fn()} sortBy="price" sortOrder="asc" />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("shows desc sort icon", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} onSort={vi.fn()} sortBy="price" sortOrder="desc" />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("renders without onSort", () => {
    render(<ProductList products={mockProducts} onDelete={vi.fn()} />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });
});
