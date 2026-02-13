import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState, AppDispatch } from "../../store";
import {
  updateOrderStatus,
  Order,
  fetchAllOrders,
  updateFilters,
} from "../../store/slices/orderSlice";
import AdminLayout from "../../components/AdminLayout";
import OrderList from "../../components/OrderList";

const orderStatuses = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, error, filters } = useSelector(
    (state: RootState) => state.orders,
  );
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch, debouncedFilters]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: Order["status"],
  ) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    dispatch(updateFilters({ status: status || undefined }));
  };

  const handleTotalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? Number(value) : undefined;
    dispatch(updateFilters({ [name]: numValue }));
  };

  const handleSortChange = (field: "id" | "createdAt" | "status" | "total") => {
    const newSortOrder =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";

    dispatch(
      updateFilters({
        sortBy: field,
        sortOrder: newSortOrder,
      }),
    );
  };

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Orders Management</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minTotal"
                value={filters.minTotal || ""}
                onChange={handleTotalFilterChange}
                placeholder="Min Total"
                className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                name="maxTotal"
                value={filters.maxTotal || ""}
                onChange={handleTotalFilterChange}
                placeholder="Max Total"
                className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filters.status || ""}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <OrderList
          orders={orders}
          onStatusChange={handleStatusChange}
          onSort={handleSortChange}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
        />
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
