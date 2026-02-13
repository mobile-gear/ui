import React from "react";
import { Product } from "../../store/slices/productSlice";
import { BiSort, BiSortUp, BiSortDown } from "react-icons/bi";

interface ProductListProps {
  products: Product[];
  onDelete: (id: number) => void;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const columns: Column[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
];

const ProductList: React.FC<ProductListProps> = ({
  products,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const getSortIcon = (field: string) => {
    if (!onSort) return null;
    if (sortBy !== field) {
      return <BiSort className="h-5 w-5" />;
    }
    return sortOrder === "asc" ? (
      <BiSortUp className="h-5 w-5" />
    ) : (
      <BiSortDown className="h-5 w-5" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-2 px-4 border-b ${
                  column.sortable && onSort
                    ? "cursor-pointer hover:bg-gray-200"
                    : ""
                }`}
                onClick={() => {
                  if (column.sortable && onSort) {
                    onSort(column.key);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{product.id}</td>
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.category}</td>
              <td className="py-2 px-4">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4">{product.stock}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
