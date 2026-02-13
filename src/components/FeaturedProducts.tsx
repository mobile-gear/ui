import Carousel from "react-multi-carousel";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const FeaturedProducts = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 640 },
      items: 2,
    },
    smallMobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
    },
  };

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="px-4"
      >
        {products.slice(0, 8).map((product) => (
          <div key={product.id} className="h-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
            >
              <div className="relative overflow-hidden group">
                <img
                  src={product.img || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/products/${product.id}`}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedProducts;
