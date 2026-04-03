import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const renderWith = (route = "/admin/orders") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AdminLayout>
        <div data-test="child-content">Child Content</div>
      </AdminLayout>
    </MemoryRouter>
  );

describe("AdminLayout", () => {
  it("renders children", () => {
    renderWith();

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders admin label and navigation links", () => {
    renderWith();

    expect(screen.getByTestId("admin-label")).toHaveTextContent("Admin");
    expect(screen.getByTestId("admin-nav-orders")).toBeInTheDocument();
    expect(screen.getByTestId("admin-nav-products")).toBeInTheDocument();
  });

  it("renders correct hrefs for navigation links", () => {
    renderWith();

    expect(screen.getByTestId("admin-nav-orders")).toHaveAttribute(
      "href",
      "/admin/orders"
    );
    expect(screen.getByTestId("admin-nav-products")).toHaveAttribute(
      "href",
      "/admin/products"
    );
  });

  it("marks Orders as active and Products as inactive on /admin/orders", () => {
    renderWith("/admin/orders");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(ordersLink.className).toContain("bg-[#FF4500]");
    expect(ordersLink.className).toContain("text-white");

    expect(productsLink.className).not.toContain("bg-[#FF4500]");
    expect(productsLink.className).toContain("text-[#7A7A8C]");
  });

  it("marks Products as active and Orders as inactive on /admin/products", () => {
    renderWith("/admin/products");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(productsLink.className).toContain("bg-[#FF4500]");
    expect(productsLink.className).toContain("text-white");

    expect(ordersLink.className).not.toContain("bg-[#FF4500]");
    expect(ordersLink.className).toContain("text-[#7A7A8C]");
  });

  it("marks both links as inactive on an unknown admin route", () => {
    renderWith("/admin/dashboard");

    const ordersLink = screen.getByTestId("admin-nav-orders");
    const productsLink = screen.getByTestId("admin-nav-products");

    expect(ordersLink.className).not.toContain("bg-[#FF4500]");
    expect(productsLink.className).not.toContain("bg-[#FF4500]");

    expect(ordersLink.className).toContain("text-[#7A7A8C]");
    expect(productsLink.className).toContain("text-[#7A7A8C]");
  });
});
