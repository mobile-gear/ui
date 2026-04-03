import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes";

vi.mock("@/pages/Home", () => ({
  default: () => <div data-test="home-page">Home Page</div>,
}));

vi.mock("@/pages/Login", () => ({
  default: () => <div data-test="login-page">Login Page</div>,
}));

vi.mock("@/pages/Register", () => ({
  default: () => <div data-test="register-page">Register Page</div>,
}));

vi.mock("@/pages/ProductsPage", () => ({
  default: () => <div data-test="products-page">Products Page</div>,
}));

vi.mock("@/pages/ProductDetail", () => ({
  default: () => <div data-test="product-detail-page">Product Detail Page</div>,
}));

vi.mock("@/pages/Cart", () => ({
  default: () => <div data-test="cart-page">Cart Page</div>,
}));

vi.mock("@/pages/Checkout", () => ({
  default: () => <div data-test="checkout-page">Checkout Page</div>,
}));

vi.mock("@/pages/CheckoutSuccess", () => ({
  default: () => <div data-test="checkout-success-page">Checkout Success Page</div>,
}));

vi.mock("@/pages/OrderHistory", () => ({
  default: () => <div data-test="order-history-page">Order History Page</div>,
}));

vi.mock("@/pages/admin/OrdersPage", () => ({
  default: () => <div data-test="admin-orders-page">Admin Orders Page</div>,
}));

vi.mock("@/pages/admin/ProductsPage", () => ({
  default: () => <div data-test="admin-products-page">Admin Products Page</div>,
}));

vi.mock("@/pages/AdminDashboard", () => ({
  default: () => <div data-test="admin-dashboard-page">Admin Dashboard Page</div>,
}));

const privateRouteSpy = vi.fn();

vi.mock("@/components/PrivateRoute", () => ({
  default: ({
    children,
    allowedRoles,
  }: {
    children: React.ReactNode;
    allowedRoles: string[];
  }) => {
    privateRouteSpy(allowedRoles);
    return (
      <div data-test="private-route" data-roles={allowedRoles.join(",")}>
        {children}
      </div>
    );
  },
}));

const renderWithRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );

describe("AppRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Home on /", () => {
    renderWithRoute("/");
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders Login on /login", () => {
    renderWithRoute("/login");
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders Register on /register", () => {
    renderWithRoute("/register");
    expect(screen.getByTestId("register-page")).toBeInTheDocument();
  });

  it("renders Products on /products", () => {
    renderWithRoute("/products");
    expect(screen.getByTestId("products-page")).toBeInTheDocument();
  });

  it("renders ProductDetail on /products/:id", () => {
    renderWithRoute("/products/123");
    expect(screen.getByTestId("product-detail-page")).toBeInTheDocument();
  });

  it("wraps /cart with PrivateRoute for user and admin", () => {
    renderWithRoute("/cart");

    expect(screen.getByTestId("private-route")).toBeInTheDocument();
    expect(screen.getByTestId("cart-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["user", "admin"]);
  });

  it("wraps /checkout with PrivateRoute for user and admin", () => {
    renderWithRoute("/checkout");

    expect(screen.getByTestId("private-route")).toBeInTheDocument();
    expect(screen.getByTestId("checkout-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["user", "admin"]);
  });

  it("wraps /checkout/success with PrivateRoute for user and admin", () => {
    renderWithRoute("/checkout/success");

    expect(screen.getByTestId("checkout-success-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["user", "admin"]);
  });

  it("wraps /orders with PrivateRoute for user and admin", () => {
    renderWithRoute("/orders");

    expect(screen.getByTestId("order-history-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["user", "admin"]);
  });

  it("wraps /admin/orders with PrivateRoute for admin only", () => {
    renderWithRoute("/admin/orders");

    expect(screen.getByTestId("admin-orders-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["admin"]);
  });

  it("wraps /admin/products with PrivateRoute for admin only", () => {
    renderWithRoute("/admin/products");

    expect(screen.getByTestId("admin-products-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["admin"]);
  });

  it("wraps /admin/* with PrivateRoute for admin only", () => {
    renderWithRoute("/admin/dashboard");

    expect(screen.getByTestId("admin-dashboard-page")).toBeInTheDocument();
    expect(privateRouteSpy).toHaveBeenCalledWith(["admin"]);
  });
});