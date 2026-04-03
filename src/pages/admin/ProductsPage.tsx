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

const inputClass =
  "w-full bg-[#09090F] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]";
const labelClass =
  "block text-xs font-body font-medium text-[#7A7A8C] uppercase tracking-wider mb-1.5";

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
      updateFilters({ [name]: value === "" ? undefined : value, page: 1 }),
    );
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
    } catch {
      console.error("Failed to create product");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleteError(null);
      await dispatch(deleteProduct(id)).unwrap();
    } catch (error: unknown) {
      setDeleteError(
        isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete"
          : "Failed to delete",
      );
    }
  };

  const handleSort = (field: string) => {
    let newOrder: "asc" | "desc" | undefined;
    if (filters.sortBy !== field) newOrder = "asc";
    else if (filters.sortOrder === "asc") newOrder = "desc";
    else if (filters.sortOrder === "desc") newOrder = undefined;
    else newOrder = "asc";
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
    return (
      <AdminLayout>
        <p
          data-test="admin-products-error"
          className="text-center text-[#FF4500] font-body mt-8"
        >
          {error}
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1
        data-test="admin-products-heading"
        className="font-display font-bold text-[#F0EEFF] text-2xl mb-8"
      >
        Products
      </h1>

      {deleteError && (
        <div
          data-test="delete-error"
          className="mb-4 bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF6B47] font-body text-sm rounded-lg px-4 py-3"
        >
          {deleteError}
        </div>
      )}

      <form
        data-test="add-product-form"
        onSubmit={handleSubmit}
        className="mb-8 bg-[#13131C] border border-[#252535] rounded-2xl p-6"
      >
        <h2
          data-test="add-product-title"
          className="font-display font-bold text-[#F0EEFF] text-lg mb-5"
        >
          Add New Product
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              data-test="new-product-name"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              data-test="new-product-category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className={inputClass + " appearance-none"}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#13131C]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              data-test="new-product-price"
              type="number"
              name="price"
              value={newProduct.price || ""}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input
              data-test="new-product-stock"
              type="number"
              name="stock"
              value={newProduct.stock || ""}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              data-test="new-product-img"
              type="text"
              name="img"
              value={newProduct.img}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              data-test="new-product-description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className={inputClass + " resize-none"}
              rows={3}
              required
            />
          </div>
        </div>
        <button
          data-test="add-product-btn"
          type="submit"
          className="bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg transition-colors"
        >
          Add Product
        </button>
      </form>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className={labelClass}>Category</label>
          <select
            data-test="filter-category"
            name="category"
            value={filters.category || ""}
            onChange={handleFilterChange}
            className={inputClass + " appearance-none"}
          >
            <option value="" className="bg-[#13131C]">
              All Categories
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#13131C]">
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={labelClass}>Stock Status</label>
          <select
            data-test="filter-stock"
            name="outOfStock"
            value={filters.outOfStock?.toString() || ""}
            onChange={handleFilterChange}
            className={inputClass + " appearance-none"}
          >
            <option value="" className="bg-[#13131C]">
              All Products
            </option>
            <option value="yes" className="bg-[#13131C]">
              Out of Stock
            </option>
            <option value="no" className="bg-[#13131C]">
              In Stock
            </option>
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
          onPageChange={(page) => dispatch(updateFilters({ page }))}
        />
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
