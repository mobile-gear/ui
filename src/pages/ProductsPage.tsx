import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchProducts, updateFilters } from "../store/slices/productSlice";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { BiSortUp, BiSortDown, BiSort } from "react-icons/bi";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "smartphone", label: "Smartphones" },
  { value: "tablets", label: "Tablets" },
  { value: "accessories", label: "Accessories" },
];

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, error, loading, filters, pagination } = useSelector(
    (state: RootState) => state.products,
  );

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, debouncedFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFilters({ searchTerm: e.target.value, page: 1 }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? undefined : Number(value);
    dispatch(updateFilters({ [name]: numValue, page: 1 }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    dispatch(updateFilters({ category: value, page: 1 }));
  };

  const handleSort = (field: string) => {
    let newOrder: "asc" | "desc" | undefined;

    if (filters.sortBy !== field) {
      newOrder = "asc";
    } else {
      if (filters.sortOrder === "asc") {
        newOrder = "desc";
      } else if (filters.sortOrder === "desc") {
        newOrder = undefined;
      } else {
        newOrder = "asc";
      }
    }

    dispatch(
      updateFilters({
        sortBy: newOrder ? field : undefined,
        sortOrder: newOrder,
        page: 1,
      }),
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
  };

  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) {
      return <BiSort className="h-5 w-5" />;
    }
    return filters.sortOrder === "asc" ? (
      <BiSortUp className="h-5 w-5" />
    ) : (
      <BiSortDown className="h-5 w-5" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm || ""}
            onChange={handleSearch}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSort("price")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-2"
            title="Sort by price"
          >
            <span>Price</span> {getSortIcon("price")}
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={filters.category || ""}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min. Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              min="0"
              value={filters.minPrice ?? ""}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min. price"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max. Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              min={filters.minPrice || 0}
              value={filters.maxPrice ?? ""}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Max. price"
            />
          </div>
        </div>
      </div>

      <ProductList products={products} error={error} loading={loading} />

      {pagination && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsPage;
