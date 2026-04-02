import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchAllOrders, updateOrderStatus, Order } from "../store/slices/orderSlice";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../store/slices/productSlice";
import AdminLayout from "../components/AdminLayout";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  img: string;
}

const emptyProduct: Product = { id: 0, name: "", description: "", price: 0, category: "", stock: 0, img: "" };

const statusStyle: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  processing: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  shipped: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cancelled: "bg-[#FF4500]/10 text-[#FF6B47] border-[#FF4500]/20",
  pending: "bg-[#252535] text-[#9B9BAD] border-[#252535]",
};

const inputClass =
  "w-full bg-[#09090F] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading: ordersLoading, error } = useSelector((state: RootState) => state.orders);
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newProduct, setNewProduct] = useState<Product>(emptyProduct);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleStatusChange = async (orderId: number, newStatus: Order["status"]) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
    } catch {}
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createProduct(newProduct));
    setNewProduct(emptyProduct);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setNewProduct(product);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const { name, description, price, category, stock, img } = newProduct;
    dispatch(updateProduct({ id: editingProduct, product: { name, description, price, category, stock, img } }));
    setEditingProduct(null);
    setNewProduct(emptyProduct);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Delete this product?")) dispatch(deleteProduct(productId));
  };

  const filteredOrders = selectedStatus === "all" ? orders : orders.filter((o) => o.status === selectedStatus);

  if (ordersLoading)
    return (
      <div className="min-h-screen bg-[#09090F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FF4500]" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#09090F] flex items-center justify-center">
        <p className="text-[#FF4500] font-body">{error}</p>
      </div>
    );

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-10">
      <section className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-[#F0EEFF] text-2xl">Orders</h1>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#13131C] border border-[#252535] text-[#9B9BAD] rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#13131C] border border-[#252535] rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-display font-bold text-[#F0EEFF] text-sm">
                    Order #{order.id}
                  </p>
                  <p className="text-[#7A7A8C] font-body text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                  className={`text-xs font-body font-semibold border rounded-full px-3 py-1 focus:outline-none cursor-pointer ${statusStyle[order.status] || statusStyle.pending}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="border-t border-[#252535] pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-xs text-[#7A7A8C] uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#9B9BAD] font-body">
                          {item.product?.name || `Product #${item.productId}`} × {item.quantity}
                        </span>
                        <span className="text-[#F0EEFF] font-body">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs text-[#7A7A8C] uppercase tracking-wider mb-2">Shipping</p>
                  <div className="text-[#9B9BAD] font-body text-sm space-y-0.5">
                    <p>{order.shippingAddress?.street}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#252535] mt-4 pt-4 flex justify-between items-center">
                <span className="text-[#7A7A8C] font-body text-sm">Total</span>
                <span className="font-display font-bold text-[#FF4500] text-lg">
                  ${order.total.toFixed?.(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-[#F0EEFF] text-2xl mb-6">Products</h2>

        <form
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          className="bg-[#13131C] border border-[#252535] rounded-2xl p-6 mb-8"
        >
          <h3 className="font-display font-bold text-[#F0EEFF] text-lg mb-5">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
              className={inputClass}
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
              className={inputClass + " appearance-none"}
            >
              <option value="" className="bg-[#13131C]">Select category</option>
              <option value="smartphone" className="bg-[#13131C]">Smartphones</option>
              <option value="tablets" className="bg-[#13131C]">Tablets</option>
              <option value="accessories" className="bg-[#13131C]">Accessories</option>
              <option value="wearables" className="bg-[#13131C]">Wearables</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price || ""}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              required
              step="0.01"
              className={inputClass}
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock || ""}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
              required
              className={inputClass}
            />
          </div>

          <textarea
            placeholder="Product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
            rows={3}
            className={inputClass + " resize-none mb-4"}
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.img}
            onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
            required
            className={inputClass + " mb-4"}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors"
            >
              {editingProduct ? "Update" : "Add Product"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => { setEditingProduct(null); setNewProduct(emptyProduct); }}
                className="flex-1 bg-[#1E1E2C] hover:bg-[#252535] border border-[#252535] text-[#9B9BAD] font-body text-sm py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {productsLoading ? (
          <p className="text-[#7A7A8C] font-body text-sm">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products?.map((product: Product) => (
              <div
                key={product.id}
                className="bg-[#13131C] border border-[#252535] rounded-2xl overflow-hidden"
              >
                <img src={product.img} alt={product.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="font-body font-medium text-[#F0EEFF] text-sm line-clamp-1">{product.name}</p>
                  <p className="text-[#7A7A8C] font-body text-xs capitalize mt-0.5">{product.category}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-display font-bold text-[#FF4500]">${product.price.toFixed?.(2)}</span>
                    <span className="text-[#7A7A8C] font-body text-xs">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-[#1E1E2C] hover:bg-[#252535] border border-[#252535] text-[#F0EEFF] font-body text-xs py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-[#FF4500]/10 hover:bg-[#FF4500]/20 border border-[#FF4500]/20 text-[#FF6B47] font-body text-xs py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
