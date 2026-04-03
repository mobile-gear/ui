import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { productService } from "@/services/product.service";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const mockProduct = {
  id: 1,
  name: "Phone",
  description: "A phone",
  img: "img.jpg",
  price: 999,
  category: "smartphone",
  stock: 10,
};

describe("productService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("fetches products with filters", async () => {
      const response = {
        data: {
          products: [mockProduct],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        },
      };
      mockedAxios.get.mockResolvedValue(response);

      const result = await productService.getAll({
        searchTerm: "phone",
        page: 1,
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/products"),
        { params: { searchTerm: "phone", page: 1 } },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("getById", () => {
    it("fetches a single product", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.getById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/products/1"),
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe("create", () => {
    it("creates a product", async () => {
      const { id, ...newProduct } = mockProduct;
      void id;
      mockedAxios.post.mockResolvedValue({ data: mockProduct });

      const result = await productService.create(newProduct);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/products"),
        newProduct,
        { withCredentials: true },
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe("update", () => {
    it("updates a product", async () => {
      const updates = { name: "Updated Phone" };
      mockedAxios.put.mockResolvedValue({
        data: { ...mockProduct, ...updates },
      });

      const result = await productService.update(1, updates);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining("/products/1"),
        updates,
        { withCredentials: true },
      );
      expect(result.name).toBe("Updated Phone");
    });
  });

  describe("delete", () => {
    it("deletes a product and returns its id", async () => {
      mockedAxios.delete.mockResolvedValue({});

      const result = await productService.delete(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/products/1"),
        { withCredentials: true },
      );
      expect(result).toBe(1);
    });
  });
});
