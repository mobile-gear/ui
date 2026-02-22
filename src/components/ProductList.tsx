import { memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  if (loading) return <Spinner />;

  if (error)
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/products/${product.id}`}>
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          </Link>
          <div className="p-4">
            <Link
              to={`/products/${product.id}`}
              className="text-lg font-semibold hover:text-blue-600"
            >
              {product.name}
            </Link>
            <p
              className="text-gray-600 mt-2"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                minHeight: "72px",
              }}
            >
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold">${product.price}</span>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ProductList.displayName = "ProductList";
export default ProductList;
