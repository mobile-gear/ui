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

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onStatusChange,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field)
      return <FaSort className="inline ml-1 text-gray-400" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-500" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.field}
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => onSort(column.field)}
              >
                <div className="flex items-center justify-center">
                  {column.label}
                  {renderSortIcon(column.field)}
                </div>
              </th>
            ))}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{order.id}</td>
              <td className="py-2 px-4">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">{order.status}</td>
              <td className="py-2 px-4">${order.total.toFixed(2)}</td>
              <td className="py-2 px-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    onStatusChange(order.id, e.target.value as Order["status"])
                  }
                  className="p-2 border rounded"
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
