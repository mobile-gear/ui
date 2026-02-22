import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchProducts, updateFilters } from "../store/slices/productSlice";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { BiSortUp, BiSortDown, BiSort } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "smartphone", label: "Smartphones" },
  { value: "tablets", label: "Tablets" },
  { value: "accessories", label: "Accessories" },
];

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, error, loading, filters, pagination } = useSelector(
    (state: RootState) => state.products,
  );

  const [draftCategory, setDraftCategory] = useState<string>(
    filters.category || "",
  );
  const [draftSearchTerm, setDraftSearchTerm] = useState<string>(
    filters.searchTerm || "",
  );
  const [draftMinPrice, setDraftMinPrice] = useState<string>(
    filters.minPrice !== undefined ? String(filters.minPrice) : "",
  );
  const [draftMaxPrice, setDraftMaxPrice] = useState<string>(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : "",
  );
  const [draftSortBy, setDraftSortBy] = useState<string>(filters.sortBy || "");
  const [draftSortOrder, setDraftSortOrder] = useState<"asc" | "desc" | "">(
    filters.sortOrder || "",
  );

  const buildSearchFromParams = (params: URLSearchParams) => {
    const next = new URLSearchParams();

    const category = params.get("category") || "";
    const searchTerm = params.get("searchTerm") || "";
    const minPrice = params.get("minPrice") || "";
    const maxPrice = params.get("maxPrice") || "";
    const sortBy = params.get("sortBy") || "";
    const sortOrder = params.get("sortOrder") || "";

    if (category) next.set("category", category);
    if (searchTerm) next.set("searchTerm", searchTerm);
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    if (sortBy) next.set("sortBy", sortBy);
    if (sortOrder) next.set("sortOrder", sortOrder);

    return next.toString();
  };

  const buildSearchFromDraft = () => {
    const next = new URLSearchParams();

    if (draftCategory) next.set("category", draftCategory);
    if (draftSearchTerm) next.set("searchTerm", draftSearchTerm);
    if (draftMinPrice) next.set("minPrice", draftMinPrice);
    if (draftMaxPrice) next.set("maxPrice", draftMaxPrice);
    if (draftSortBy) next.set("sortBy", draftSortBy);
    if (draftSortOrder) next.set("sortOrder", draftSortOrder);

    return next.toString();
  };

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const allowedCategories = new Set(CATEGORIES.map((c) => c.value));

    const categoryParam = params.get("category") || "";
    const nextCategory = allowedCategories.has(categoryParam)
      ? categoryParam || undefined
      : filters.category;

    const searchTermParam = params.get("searchTerm") || "";
    const nextSearchTerm = searchTermParam || undefined;

    const parseNumberParam = (key: string) => {
      const raw = params.get(key);
      if (!raw) return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    };

    const nextMinPrice = parseNumberParam("minPrice");
    const nextMaxPrice = parseNumberParam("maxPrice");

    const sortByParam = params.get("sortBy") || "";
    const nextSortBy = sortByParam || undefined;

    const sortOrderParam = params.get("sortOrder") || "";
    const nextSortOrder =
      sortOrderParam === "asc" || sortOrderParam === "desc"
        ? sortOrderParam
        : undefined;

    const hasChanges =
      filters.category !== nextCategory ||
      filters.searchTerm !== nextSearchTerm ||
      filters.minPrice !== nextMinPrice ||
      filters.maxPrice !== nextMaxPrice ||
      filters.sortBy !== nextSortBy ||
      filters.sortOrder !== nextSortOrder;

    setDraftCategory(nextCategory || "");
    setDraftSearchTerm(nextSearchTerm || "");
    setDraftMinPrice(nextMinPrice !== undefined ? String(nextMinPrice) : "");
    setDraftMaxPrice(nextMaxPrice !== undefined ? String(nextMaxPrice) : "");
    setDraftSortBy(nextSortBy || "");
    setDraftSortOrder(nextSortOrder || "");

    if (!hasChanges) return;

    dispatch(
      updateFilters({
        category: nextCategory,
        searchTerm: nextSearchTerm,
        minPrice: nextMinPrice,
        maxPrice: nextMaxPrice,
        sortBy: nextSortBy,
        sortOrder: nextSortOrder,
        page: 1,
      }),
    );
  }, [dispatch, location.search]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, debouncedFilters]);

  const applyDraftFilters = () => {
    const parseDraftNumber = (raw: string) => {
      if (!raw) return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    };

    const nextCategory = draftCategory || undefined;
    const nextSearchTerm = draftSearchTerm || undefined;
    const nextMinPrice = parseDraftNumber(draftMinPrice);
    const nextMaxPrice = parseDraftNumber(draftMaxPrice);
    const nextSortBy = draftSortBy || undefined;
    const nextSortOrder = draftSortOrder || undefined;

    dispatch(
      updateFilters({
        category: nextCategory,
        searchTerm: nextSearchTerm,
        minPrice: nextMinPrice,
        maxPrice: nextMaxPrice,
        sortBy: nextSortBy,
        sortOrder: nextSortOrder,
        page: 1,
      }),
    );

    const nextSearch = buildSearchFromDraft();
    const currentParams = new URLSearchParams(location.search);
    const currentSearch = buildSearchFromParams(currentParams);

    if (nextSearch === currentSearch) return;

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraftSearchTerm(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "minPrice") setDraftMinPrice(value);
    if (name === "maxPrice") setDraftMaxPrice(value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDraftCategory(value);

    const nextCategory = value || undefined;
    dispatch(updateFilters({ category: nextCategory, page: 1 }));

    const params = new URLSearchParams(location.search);
    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    const nextSearch = buildSearchFromParams(params);
    const currentParams = new URLSearchParams(location.search);
    const currentSearch = buildSearchFromParams(currentParams);

    if (nextSearch === currentSearch) return;

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
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

    const nextSortBy = newOrder ? field : undefined;
    const nextSortOrder = newOrder;

    setDraftSortBy(nextSortBy || "");
    setDraftSortOrder(nextSortOrder || "");

    dispatch(
      updateFilters({
        sortBy: nextSortBy,
        sortOrder: nextSortOrder,
        page: 1,
      }),
    );

    const params = new URLSearchParams(location.search);
    if (nextSortBy) {
      params.set("sortBy", nextSortBy);
    } else {
      params.delete("sortBy");
    }

    if (nextSortOrder) {
      params.set("sortOrder", nextSortOrder);
    } else {
      params.delete("sortOrder");
    }

    const nextSearch = buildSearchFromParams(params);
    const currentParams = new URLSearchParams(location.search);
    const currentSearch = buildSearchFromParams(currentParams);

    if (nextSearch === currentSearch) return;

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
  };

  const getSortIcon = (field: string) => {
    if (draftSortBy !== field) {
      return <BiSort className="h-5 w-5" />;
    }
    return draftSortOrder === "asc" ? (
      <BiSortUp className="h-5 w-5" />
    ) : (
      <BiSortDown className="h-5 w-5" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        className="mb-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          applyDraftFilters();
        }}
      >
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={draftSearchTerm}
            onChange={handleSearch}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            aria-label="Ordenar por precio"
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
              value={draftCategory}
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
              value={draftMinPrice}
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
              min={draftMinPrice ? Number(draftMinPrice) || 0 : 0}
              value={draftMaxPrice}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Max. price"
            />
          </div>
        </div>
        <button
          type="submit"
          aria-label="Aplicar filtros"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Aplicar
        </button>
      </form>

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
