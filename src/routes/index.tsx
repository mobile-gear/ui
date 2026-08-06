import React from "react";
import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/ProductsPage";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import OrderHistory from "../pages/OrderHistory";
import OrdersPage from "../pages/admin/OrdersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import AdminDashboard from "../pages/AdminDashboard";
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      <Route
        path="/cart"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <Checkout />
          </PrivateRoute>
        }
      />

      <Route
        path="/checkout/success"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <CheckoutSuccess />
          </PrivateRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <OrderHistory />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <OrdersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ProductsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
