import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  Product,
  updateFilters,
} from "../../store/slices/productSlice";
import AdminLayout from "../../components/AdminLayout";
import ProductList from "../../components/admin/ProductList";
import Pagination from "../../components/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { isAxiosError } from "axios";

const CATEGORIES = [
  { value: "smartphone", label: "Smartphones" },
  { value: "tablets", label: "Tablets" },
  { value: "accessories", label: "Accessories" },
];

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, error, filters, pagination } = useSelector(
    (state: RootState) => state.products,
  );

  const debouncedFilters = useDebounce(filters, 500);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[0].value,
    img: "",
    stock: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(
      updateFilters({
        [name]: value === "" ? undefined : value,
        page: 1,
      }),
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createProduct(newProduct)).unwrap();
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: CATEGORIES[0].value,
        img: "",
        stock: 0,
      });
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleteError(null);
      await dispatch(deleteProduct(id)).unwrap();
    } catch (error: unknown) {
      console.error("Failed to delete product:", error);
      if (isAxiosError(error)) {
        setDeleteError(
          error.response?.data?.message || "Failed to delete product",
        );
      } else {
        setDeleteError("Failed to delete product");
      }
    }
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, debouncedFilters]);

  if (error)
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;

  return (
    <AdminLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-8">Product Management</h1>

        {deleteError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {deleteError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-white rounded shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-white"
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="img"
                value={newProduct.img}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Product
          </button>
        </form>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              name="category"
              value={filters.category || "all"}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              name="outOfStock"
              value={filters.outOfStock?.toString() || ""}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">All Products</option>
              <option value="yes">Out of Stock</option>
              <option value="no">In Stock</option>
            </select>
          </div>
        </div>

        <ProductList
          products={products}
          onDelete={handleDelete}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
        />

        {pagination && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
