import React from "react";
import { Order } from "../store/slices/orderSlice";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: number, status: Order["status"]) => void;
  onSort: (field: "id" | "createdAt" | "status" | "total") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ColumnHeader {
  field: "id" | "createdAt" | "status" | "total";
  label: string;
}

const columns: ColumnHeader[] = [
  { field: "id", label: "Order ID" },
  { field: "createdAt", label: "Date" },
  { field: "status", label: "Status" },
  { field: "total", label: "Total" },
];

const statusStyle: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  processing: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  shipped: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cancelled: "bg-[#FF4500]/10 text-[#FF6B47] border-[#FF4500]/20",
  pending: "bg-[#252535] text-[#9B9BAD] border-[#252535]",
};

const OrderList: React.FC<OrderListProps> = ({ orders, onStatusChange, onSort, sortBy, sortOrder }) => {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <FaSort className="inline ml-1 text-[#3A3A4A]" />;
    return sortOrder === "asc"
      ? <FaSortUp className="inline ml-1 text-[#FF4500]" />
      : <FaSortDown className="inline ml-1 text-[#FF4500]" />;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#252535]">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[#1E1E2C] border-b border-[#252535]">
            {columns.map((col) => (
              <th
                key={col.field}
                onClick={() => onSort(col.field)}
                className="py-3 px-4 text-left font-body text-xs text-[#7A7A8C] uppercase tracking-wider cursor-pointer hover:text-[#F0EEFF] transition-colors select-none"
              >
                {col.label} {renderSortIcon(col.field)}
              </th>
            ))}
            <th className="py-3 px-4 text-left font-body text-xs text-[#7A7A8C] uppercase tracking-wider">
              Update
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#13131C] divide-y divide-[#252535]">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-[#1E1E2C] transition-colors">
              <td className="py-3 px-4 font-body text-sm text-[#F0EEFF]">#{order.id}</td>
              <td className="py-3 px-4 font-body text-sm text-[#9B9BAD]">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs font-body font-semibold border rounded-full px-2.5 py-0.5 ${statusStyle[order.status] || statusStyle.pending}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-4 font-display font-bold text-[#FF4500] text-sm">
                ${order.total.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as Order["status"])}
                  className="bg-[#1E1E2C] border border-[#252535] text-[#9B9BAD] rounded-lg px-2 py-1.5 font-body text-xs focus:outline-none focus:border-[#FF4500] transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
