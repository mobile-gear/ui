import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const renderWith = (route = "/admin/orders") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AdminLayout>
        <div>Child Content</div>
      </AdminLayout>
    </MemoryRouter>,
  );

describe("AdminLayout", () => {
  it("renders children", () => {
    renderWith();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders Orders and Products links", () => {
    renderWith();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("shows Admin label", () => {
    renderWith();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("applies active style to Orders link on /admin/orders", () => {
    renderWith("/admin/orders");
    const ordersLink = screen.getByText("Orders");
    expect(ordersLink.className).toContain("bg-[#FF4500]");
  });

  it("applies active style to Products link on /admin/products", () => {
    renderWith("/admin/products");
    const productsLink = screen.getByText("Products");
    expect(productsLink.className).toContain("bg-[#FF4500]");
  });

  it("does not apply active style to non-matching link", () => {
    renderWith("/admin/orders");
    const productsLink = screen.getByText("Products");
    expect(productsLink.className).not.toContain("bg-[#FF4500]");
  });
});
