import { memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppDispatch } from "../store";
import { Product } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import Spinner from "./Spinner";

interface ProductListProps {
  products: Product[];
  error: string | null;
  loading: boolean;
}

const ProductList = memo(({ products, error, loading }: ProductListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  if (loading) return <Spinner />;
  if (error)
    return (
      <p
        data-test="product-list-error"
        className="text-center text-[#FF4500] text-sm mt-8"
      >
        {error}
      </p>
    );
  if (products.length === 0)
    return (
      <p
        data-test="product-list-empty"
        className="text-center text-[#7A7A8C] font-body mt-12"
      >
        No products found.
      </p>
    );

  return (
    <div
      data-test="product-list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          data-test="product-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="bg-[#13131C] border border-[#252535] hover:border-[#FF4500]/40 rounded-2xl overflow-hidden flex flex-col transition-colors duration-300 group"
        >
          <Link
            to={`/products/${product.id}`}
            className="block overflow-hidden"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <div className="p-4 flex flex-col flex-1">
            <Link
              to={`/products/${product.id}`}
              data-test="product-name"
              className="font-body font-medium text-[#F0EEFF] hover:text-[#FF4500] transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <p
              className="text-[#7A7A8C] font-body text-xs mt-2 flex-1"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                minHeight: "3.5rem",
              }}
            >
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span
                data-test="product-price"
                className="font-display font-bold text-[#FF4500] text-lg"
              >
                ${product.price.toFixed(2)}
              </span>
              <button
                data-test="add-to-cart"
                onClick={() => dispatch(addToCart(product))}
                className="bg-[#FF4500] hover:bg-[#FF6B47] text-white font-body text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

ProductList.displayName = "ProductList";
export default ProductList;
