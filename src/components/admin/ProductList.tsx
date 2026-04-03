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
    if (sortBy !== field) return <BiSort className="h-4 w-4 text-[#3A3A4A]" />;
    return sortOrder === "asc" ? (
      <BiSortUp className="h-4 w-4 text-[#FF4500]" />
    ) : (
      <BiSortDown className="h-4 w-4 text-[#FF4500]" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#252535]">
      <table data-test="admin-product-table" className="min-w-full">
        <thead>
          <tr className="bg-[#1E1E2C] border-b border-[#252535]">
            {columns.map((col) => (
              <th
                key={col.key}
                data-test={`th-${col.key}`}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={`py-3 px-4 text-left font-body text-xs text-[#7A7A8C] uppercase tracking-wider select-none ${col.sortable && onSort ? "cursor-pointer hover:text-[#F0EEFF] transition-colors" : ""}`}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#13131C] divide-y divide-[#252535]">
          {products.map((product) => (
            <tr
              key={product.id}
              data-test={`product-row-${product.id}`}
              className="hover:bg-[#1E1E2C] transition-colors"
            >
              <td className="py-3 px-4 font-body text-sm text-[#7A7A8C]">
                {product.id}
              </td>
              <td
                data-test="product-name"
                className="py-3 px-4 font-body text-sm text-[#F0EEFF] max-w-[12rem] truncate"
              >
                {product.name}
              </td>
              <td className="py-3 px-4 font-body text-sm text-[#9B9BAD] capitalize">
                {product.category}
              </td>
              <td
                data-test="product-price"
                className="py-3 px-4 font-display font-bold text-[#FF4500] text-sm"
              >
                ${product.price.toFixed(2)}
              </td>
              <td className="py-3 px-4 font-body text-sm text-[#9B9BAD]">
                {product.stock}
              </td>
              <td className="py-3 px-4">
                <button
                  data-test="delete-product"
                  onClick={() => onDelete(product.id)}
                  className="text-xs font-body text-[#FF6B47] hover:text-[#FF4500] transition-colors"
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
