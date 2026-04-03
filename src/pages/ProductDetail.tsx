import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import Spinner from "../components/Spinner";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, loading, error } = useSelector(
    (state: RootState) => state.products,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(parseInt(id)));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      for (let i = 0; i < quantity; i++) dispatch(addToCart(selectedProduct));
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <p
        data-test="product-error"
        className="text-center text-[#FF4500] font-body mt-12"
      >
        {error}
      </p>
    );
  if (!selectedProduct)
    return (
      <p
        data-test="product-not-found"
        className="text-center text-[#7A7A8C] font-body mt-12"
      >
        Product not found.
      </p>
    );

  const stockStatus =
    selectedProduct.stock > 10
      ? {
          label: `${selectedProduct.stock} in stock`,
          color: "text-emerald-400",
        }
      : selectedProduct.stock > 0
        ? {
            label: `Only ${selectedProduct.stock} left`,
            color: "text-amber-400",
          }
        : { label: "Out of stock", color: "text-[#FF4500]" };

  return (
    <div className="min-h-screen bg-[#09090F]">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          <div className="bg-[#13131C] border border-[#252535] rounded-2xl overflow-hidden flex items-center justify-center p-6">
            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="w-full max-h-96 object-contain"
            />
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div>
              <span
                data-test="product-category"
                className="inline-block bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] text-xs font-body font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
              >
                {selectedProduct.category}
              </span>
              <h1
                data-test="product-name"
                className="font-display font-bold text-[#F0EEFF] text-3xl leading-tight"
              >
                {selectedProduct.name}
              </h1>
            </div>

            <p className="text-[#7A7A8C] font-body text-sm leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="flex items-baseline gap-3">
              <span
                data-test="product-price"
                className="font-display font-bold text-[#FF4500] text-4xl"
              >
                ${selectedProduct.price.toFixed(2)}
              </span>
            </div>

            <p
              data-test="stock-status"
              className={`font-body text-sm font-medium ${stockStatus.color}`}
            >
              {stockStatus.label}
            </p>

            {selectedProduct.stock > 0 && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="quantity"
                  className="text-[#7A7A8C] font-body text-sm"
                >
                  Quantity
                </label>
                <div className="flex items-center bg-[#13131C] border border-[#252535] rounded-lg overflow-hidden">
                  <button
                    data-test="qty-decrement"
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-[#9B9BAD] hover:text-[#F0EEFF] hover:bg-[#1E1E2C] transition-colors font-body text-lg"
                  >
                    −
                  </button>
                  <input
                    data-test="quantity-input"
                    type="number"
                    id="quantity"
                    min="1"
                    max={selectedProduct.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-12 text-center bg-transparent text-[#F0EEFF] font-body text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    data-test="qty-increment"
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedProduct.stock, q + 1))
                    }
                    className="px-3 py-2 text-[#9B9BAD] hover:text-[#F0EEFF] hover:bg-[#1E1E2C] transition-colors font-body text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <motion.button
              data-test="add-to-cart"
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
              className="w-full bg-[#FF4500] hover:bg-[#FF6B47] disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-colors"
            >
              {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
