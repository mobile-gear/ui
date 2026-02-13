import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchAllOrders,
  updateOrderStatus,
  Order,
} from "../store/slices/orderSlice";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  img: string;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    orders,
    isLoading: ordersLoading,
    error,
  } = useSelector((state: RootState) => state.orders);
  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.products,
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    img: "",
  });

  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: Order["status"],
  ) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createProduct(newProduct));
    setNewProduct({
      id: 0,
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      img: "",
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setNewProduct(product);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const { name, description, price, category, stock, img } = newProduct;
      dispatch(
        updateProduct({
          id: editingProduct,
          product: { name, description, price, category, stock, img },
        }),
      );
      setEditingProduct(null);
      setNewProduct({
        id: 0,
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        img: "",
      });
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <label htmlFor="status-filter" className="mr-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value as Order["status"],
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">
                          {item.product?.name || `Product #${item.productId}`} x{" "}
                          {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-gray-600">
                    <p>{order.shippingAddress?.street ?? ""}</p>
                    <p>
                      {order.shippingAddress?.city ?? ""},{" "}
                      {order.shippingAddress?.state ?? ""}{" "}
                      {order.shippingAddress?.zipCode ?? ""}
                    </p>
                    <p>{order.shippingAddress?.country ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">
                ${order.total.toFixed?.(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Product Management
        </h2>

        <form
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-black">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
              className="p-2 border rounded"
            />
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              required
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Tablets">Tablets</option>
              <option value="Accessories">Accessories</option>
              <option value="Wearables">Wearables</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseFloat(e.target.value),
                })
              }
              required
              step="0.01"
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: parseInt(e.target.value),
                })
              }
              required
              className="p-2 border rounded"
            />
          </div>

          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            required
            className="w-full p-2 border rounded mt-4"
            rows={3}
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.img}
            onChange={(e) =>
              setNewProduct({ ...newProduct, img: e.target.value })
            }
            required
            className="w-full p-2 border rounded mt-4"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  id: 0,
                  name: "",
                  description: "",
                  price: 0,
                  category: "",
                  stock: 0,
                  img: "",
                });
              }}
              className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productsLoading ? (
            <p>Loading products...</p>
          ) : (
            products?.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 capitalize">{product.category}</p>
                  <p className="text-xl font-bold">
                    ${product.price.toFixed?.(2)}
                  </p>
                  <p className="text-gray-600">Stock: {product.stock}</p>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
