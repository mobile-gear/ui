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

const inputClass =
  "w-full bg-[#13131C] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]";
const labelClass = "block text-xs font-medium text-[#7A7A8C] mb-1.5 font-body uppercase tracking-wider";

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, error, loading, filters, pagination } = useSelector(
    (state: RootState) => state.products,
  );

  const parsePageParam = (params: URLSearchParams) => {
    const raw = params.get("page");
    if (!raw) return 1;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.floor(n));
  };

  const [draftCategory, setDraftCategory] = useState<string>(filters.category || "");
  const [draftSearchTerm, setDraftSearchTerm] = useState<string>(filters.searchTerm || "");
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
    const page = parsePageParam(params);
    if (category) next.set("category", category);
    if (searchTerm) next.set("searchTerm", searchTerm);
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    if (sortBy) next.set("sortBy", sortBy);
    if (sortOrder) next.set("sortOrder", sortOrder);
    next.set("page", String(page));
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
    next.set("page", "1");
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
      sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : undefined;
    const nextPage = parsePageParam(params);

    if (!params.get("page")) {
      params.set("page", String(nextPage));
      const nextSearch = buildSearchFromParams(params);
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
    }

    const hasChanges =
      filters.category !== nextCategory ||
      filters.searchTerm !== nextSearchTerm ||
      filters.minPrice !== nextMinPrice ||
      filters.maxPrice !== nextMaxPrice ||
      filters.sortBy !== nextSortBy ||
      filters.sortOrder !== nextSortOrder ||
      (filters.page || 1) !== nextPage;

    setDraftCategory(nextCategory || "");
    setDraftSearchTerm(nextSearchTerm || "");
    setDraftMinPrice(nextMinPrice !== undefined ? String(nextMinPrice) : "");
    setDraftMaxPrice(nextMaxPrice !== undefined ? String(nextMaxPrice) : "");
    setDraftSortBy(nextSortBy || "");
    setDraftSortOrder(nextSortOrder || "");

    if (!hasChanges) return;

    dispatch(updateFilters({
      category: nextCategory,
      searchTerm: nextSearchTerm,
      minPrice: nextMinPrice,
      maxPrice: nextMaxPrice,
      sortBy: nextSortBy,
      sortOrder: nextSortOrder,
      page: nextPage,
    }));
  }, [dispatch, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, debouncedFilters]);

  const applyDraftFilters = () => {
    const parseDraftNumber = (raw: string) => {
      if (!raw) return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    };

    dispatch(updateFilters({
      category: draftCategory || undefined,
      searchTerm: draftSearchTerm || undefined,
      minPrice: parseDraftNumber(draftMinPrice),
      maxPrice: parseDraftNumber(draftMaxPrice),
      sortBy: draftSortBy || undefined,
      sortOrder: draftSortOrder || undefined,
      page: 1,
    }));

    const nextSearch = buildSearchFromDraft();
    const currentSearch = buildSearchFromParams(new URLSearchParams(location.search));
    if (nextSearch === currentSearch) return;
    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDraftCategory(value);
    dispatch(updateFilters({ category: value || undefined, page: 1 }));
    const params = new URLSearchParams(location.search);
    if (value) params.set("category", value);
    else params.delete("category");
    params.set("page", "1");
    const nextSearch = buildSearchFromParams(params);
    const currentSearch = buildSearchFromParams(new URLSearchParams(location.search));
    if (nextSearch === currentSearch) return;
    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
  };

  const handleSort = (field: string) => {
    let newOrder: "asc" | "desc" | undefined;
    if (filters.sortBy !== field) newOrder = "asc";
    else if (filters.sortOrder === "asc") newOrder = "desc";
    else if (filters.sortOrder === "desc") newOrder = undefined;
    else newOrder = "asc";

    const nextSortBy = newOrder ? field : undefined;
    setDraftSortBy(nextSortBy || "");
    setDraftSortOrder(newOrder || "");
    dispatch(updateFilters({ sortBy: nextSortBy, sortOrder: newOrder, page: 1 }));

    const params = new URLSearchParams(location.search);
    if (nextSortBy) params.set("sortBy", nextSortBy); else params.delete("sortBy");
    if (newOrder) params.set("sortOrder", newOrder); else params.delete("sortOrder");
    params.set("page", "1");
    const nextSearch = buildSearchFromParams(params);
    const currentSearch = buildSearchFromParams(new URLSearchParams(location.search));
    if (nextSearch === currentSearch) return;
    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
  };

  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    const nextSearch = buildSearchFromParams(params);
    const currentSearch = buildSearchFromParams(new URLSearchParams(location.search));
    if (nextSearch === currentSearch) return;
    navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
  };

  const getSortIcon = (field: string) => {
    if (draftSortBy !== field) return <BiSort className="h-4 w-4" />;
    return draftSortOrder === "asc" ? <BiSortUp className="h-4 w-4" /> : <BiSortDown className="h-4 w-4" />;
  };

  const totalCount = pagination
    ? ((pagination as unknown as { count?: number }).count ?? pagination.total ?? 0)
    : 0;
  const derivedTotalPages = pagination
    ? totalCount > 0 ? Math.ceil(totalCount / 10) : pagination.totalPages
    : 1;
  const isNextDisabled = totalCount > 0 ? (filters.page || 1) * 10 >= totalCount : false;

  return (
    <div className="min-h-screen bg-[#09090F]">
      <div className="container mx-auto px-6 py-10">
        <h1 data-test="products-heading" className="font-display font-bold text-[#F0EEFF] text-3xl mb-8">Products</h1>

        <form
          className="mb-8 bg-[#13131C] border border-[#252535] rounded-2xl p-6 space-y-5"
          onSubmit={(e) => { e.preventDefault(); applyDraftFilters(); }}
        >
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelClass}>Search</label>
              <input
                data-test="search-input"
                type="text"
                placeholder="Search products..."
                value={draftSearchTerm}
                onChange={(e) => setDraftSearchTerm(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              aria-label="Sort by price"
              data-test="sort-price"
              onClick={() => handleSort("price")}
              className="flex items-center gap-2 bg-[#1E1E2C] border border-[#252535] hover:border-[#FF4500]/40 text-[#9B9BAD] hover:text-[#F0EEFF] font-body text-sm px-4 py-2.5 rounded-lg transition-colors"
              title="Sort by price"
            >
              Price {getSortIcon("price")}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <select
                data-test="category-filter"
                id="category"
                value={draftCategory}
                onChange={handleCategoryChange}
                className={inputClass + " appearance-none"}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-[#13131C]">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className={labelClass}>Min. Price</label>
              <input
                data-test="min-price"
                type="number"
                id="minPrice"
                name="minPrice"
                min="0"
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className={labelClass}>Max. Price</label>
              <input
                data-test="max-price"
                type="number"
                id="maxPrice"
                name="maxPrice"
                min={draftMinPrice ? Number(draftMinPrice) || 0 : 0}
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                className={inputClass}
                placeholder="Any"
              />
            </div>
          </div>

          <button
            data-test="apply-filters"
            type="submit"
            className="w-full bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </form>

        <ProductList products={products} error={error} loading={loading} />

        {pagination && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={derivedTotalPages}
            isNextDisabled={isNextDisabled}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
