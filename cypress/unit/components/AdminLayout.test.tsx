import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const renderWith = (route = "/admin/orders") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AdminLayout>
        <div data-test="child-content">Child Content</div>
      </AdminLayout>
    </MemoryRouter>,
  );

describe("AdminLayout - Branch Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children", () => {
    renderWith();

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders admin label and navigation links", () => {
    renderWith();

    expect(screen.getByTestId("admin-badge")).toHaveTextContent("Admin");
    expect(screen.getByTestId("admin-nav-orders")).toBeInTheDocument();
    expect(screen.getByTestId("admin-nav-products")).toBeInTheDocument();
  });

  it("renders correct hrefs for navigation links", () => {
    renderWith();

    expect(screen.getByTestId("admin-nav-orders")).toHaveAttribute(
      "href",
      "/admin/orders",
    );
    expect(screen.getByTestId("admin-nav-products")).toHaveAttribute(
      "href",
      "/admin/products",
    );
  });

  it("marks Orders as active and Products as inactive on /admin/orders", () => {
    renderWith("/admin/orders");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(ordersLink.className).toMatch(/bg-\[#FF4500\]|text-white/);
    expect(ordersLink.className).not.toMatch(/text-\[#7A7A8C\]/);

    expect(productsLink.className).not.toMatch(/bg-\[#FF4500\]|text-white/);
    expect(productsLink.className).toMatch(/text-\[#7A7A8C\]/);
  });

  it("marks Products as active and Orders as inactive on /admin/products", () => {
    renderWith("/admin/products");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(productsLink.className).toMatch(/bg-\[#FF4500\]|text-white/);
    expect(productsLink.className).not.toMatch(/text-\[#7A7A8C\]/);

    expect(ordersLink.className).not.toMatch(/bg-\[#FF4500\]|text-white/);
    expect(ordersLink.className).toMatch(/text-\[#7A7A8C\]/);
  });

  it("marks both links as inactive on an unknown admin route", () => {
    renderWith("/admin/dashboard");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(ordersLink.className).not.toMatch(/bg-\[#FF4500\]|text-white/);
    expect(productsLink.className).not.toMatch(/bg-\[#FF4500\]|text-white/);
    expect(ordersLink.className).toMatch(/text-\[#7A7A8C\]/);
    expect(productsLink.className).toMatch(/text-\[#7A7A8C\]/);
  });

  it("handles root admin route correctly", () => {
    renderWith("/admin");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(ordersLink.className).not.toMatch(/bg-\[#FF4500\]/);
    expect(productsLink.className).not.toMatch(/bg-\[#FF4500\]/);
  });

  it("handles nested admin routes", () => {
    renderWith("/admin/orders/123");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    expect(ordersLink.className).not.toMatch(/bg-\[#FF4500\]/);
    expect(ordersLink.className).toMatch(/text-\[#7A7A8C\]/);
  });

  it("handles nested product routes", () => {
    renderWith("/admin/products/456");

    const productsLink = screen.getByTestId("admin-nav-products");
    expect(productsLink.className).not.toMatch(/bg-\[#FF4500\]/);
    expect(productsLink.className).toMatch(/text-\[#7A7A8C\]/);
  });

  it("renders admin badge with correct styling", () => {
    renderWith();

    const badge = screen.getByTestId("admin-badge");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Admin");
    expect(badge.className).toMatch(/text-\[#7A7A8C\]|font-body|text-xs/);
  });

  it("renders navigation container", () => {
    renderWith();

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav.className).toMatch(/bg-\[#[0-9A-Fa-f]+\]|border/);
  });

  it("renders without children gracefully", () => {
    render(
      <MemoryRouter initialEntries={["/admin/orders"]}>
        <AdminLayout>
          <></>
        </AdminLayout>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("admin-badge")).toBeInTheDocument();
  });

  it("maintains correct styling structure", () => {
    const { container } = renderWith();

    expect(container.querySelector("div")).toBeInTheDocument();
    expect(container.querySelector("nav")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeInTheDocument();
  });
});
