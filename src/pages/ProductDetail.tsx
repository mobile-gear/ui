import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(selectedProduct));
      }
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

  if (!selectedProduct) {
    return <div className="text-center text-xl mt-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <img
            src={selectedProduct.img}
            alt={selectedProduct.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-600">
            {selectedProduct.name}
          </h1>

          <div className="mb-4">
            <span className="text-gray-600">Category: </span>
            <span className="font-semibold text-gray-600">
              {selectedProduct.category}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-600">
              ${selectedProduct.price.toFixed?.(2)}
            </span>
          </div>

          <div className="mb-4">
            <span className="text-gray-600">Stock: </span>
            <span
              className={`font-semibold ${
                selectedProduct.stock > 10
                  ? "text-green-600"
                  : selectedProduct.stock > 0
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {selectedProduct.stock > 0
                ? `${selectedProduct.stock} available`
                : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 p-2 border rounded"
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={selectedProduct.stock === 0}
            className={`w-full py-3 rounded text-white font-semibold ${
              selectedProduct.stock > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
