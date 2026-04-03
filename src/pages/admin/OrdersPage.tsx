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

const inputClass =
  "bg-[#13131C] border border-[#252535] text-[#9B9BAD] rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]";

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
    } catch {
      console.error("Failed to update order status");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateFilters({ status: e.target.value || undefined }));
  };

  const handleTotalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateFilters({ [name]: value ? Number(value) : undefined }));
  };

  const handleSortChange = (field: "id" | "createdAt" | "status" | "total") => {
    const newSortOrder =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    dispatch(updateFilters({ sortBy: field, sortOrder: newSortOrder }));
  };

  if (error)
    return (
      <AdminLayout>
        <p
          data-test="orders-error"
          className="text-center text-[#FF4500] font-body mt-8"
        >
          {error}
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1
          data-test="orders-heading"
          className="font-display font-bold text-[#F0EEFF] text-2xl"
        >
          Orders
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            data-test="min-total-input"
            type="number"
            name="minTotal"
            value={filters.minTotal || ""}
            onChange={handleTotalFilterChange}
            placeholder="Min $"
            className={inputClass + " w-24"}
          />
          <span className="text-[#3A3A4A] font-body text-sm">–</span>
          <input
            data-test="max-total-input"
            type="number"
            name="maxTotal"
            value={filters.maxTotal || ""}
            onChange={handleTotalFilterChange}
            placeholder="Max $"
            className={inputClass + " w-24"}
          />
          <select
            data-test="order-status-filter"
            value={filters.status || ""}
            onChange={handleFilterChange}
            className={inputClass}
          >
            {orderStatuses.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#13131C]">
                {s.label}
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
    </AdminLayout>
  );
};

export default OrdersPage;
