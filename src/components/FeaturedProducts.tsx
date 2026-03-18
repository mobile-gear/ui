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
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#13131C] border border-[#252535] hover:border-[#FF4500]/40 rounded-2xl overflow-hidden h-full transition-colors duration-300"
            >
              <div className="relative overflow-hidden group">
                <img
                  src={product.img || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#09090F]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/products/${product.id}`}
                    className="bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-body font-medium text-[#F0EEFF] text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="font-display font-bold text-[#FF4500] text-xl">
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
