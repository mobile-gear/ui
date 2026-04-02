import { describe, it, expect } from "vitest";
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import { Product } from "@/interfaces/product";

const mockProduct: Product = {
  id: 1,
  name: "Phone Case",
  description: "A nice case",
  img: "case.jpg",
  price: 19.99,
  category: "cases",
  stock: 10,
};

const mockProduct2: Product = {
  id: 2,
  name: "Screen Protector",
  description: "Tempered glass",
  img: "screen.jpg",
  price: 9.99,
  category: "accessories",
  stock: 50,
};

const emptyState = { items: [], totalItems: 0, totalPrice: 0 };

describe("cartSlice", () => {
  it("returns the initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(emptyState);
  });

  describe("addToCart", () => {
    it("adds a new product to the cart", () => {
      const state = cartReducer(emptyState, addToCart(mockProduct));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(19.99);
    });

    it("increments quantity when adding an existing product", () => {
      const stateWithOne = cartReducer(emptyState, addToCart(mockProduct));
      const state = cartReducer(stateWithOne, addToCart(mockProduct));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBeCloseTo(39.98);
    });

    it("adds multiple different products", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, addToCart(mockProduct2));
      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBeCloseTo(29.98);
    });
  });

  describe("removeFromCart", () => {
    it("removes a product from the cart", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, removeFromCart(1));
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it("does nothing when removing a non-existent product", () => {
      const state = cartReducer(emptyState, addToCart(mockProduct));
      const newState = cartReducer(state, removeFromCart(999));
      expect(newState.items).toHaveLength(1);
      expect(newState.totalItems).toBe(1);
    });

    it("adjusts totals based on quantity when removing", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, addToCart(mockProduct));
      state = cartReducer(state, removeFromCart(1));
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity of an existing item", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, updateQuantity({ id: 1, quantity: 5 }));
      expect(state.items[0].quantity).toBe(5);
      expect(state.totalItems).toBe(5);
      expect(state.totalPrice).toBeCloseTo(99.95);
    });

    it("decreases quantity correctly", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, addToCart(mockProduct));
      state = cartReducer(state, addToCart(mockProduct));
      state = cartReducer(state, updateQuantity({ id: 1, quantity: 1 }));
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBeCloseTo(19.99);
    });

    it("does nothing for a non-existent item", () => {
      const state = cartReducer(emptyState, addToCart(mockProduct));
      const newState = cartReducer(
        state,
        updateQuantity({ id: 999, quantity: 5 }),
      );
      expect(newState.totalItems).toBe(1);
    });
  });

  describe("clearCart", () => {
    it("resets the cart to initial state", () => {
      let state = cartReducer(emptyState, addToCart(mockProduct));
      state = cartReducer(state, addToCart(mockProduct2));
      state = cartReducer(state, clearCart());
      expect(state).toEqual(emptyState);
    });
  });
});
