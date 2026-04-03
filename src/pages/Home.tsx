import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import { fetchProducts } from "../store/slices/productSlice";
import "react-multi-carousel/lib/styles.css";
import FeaturedProducts from "../components/FeaturedProducts";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const categories = [
  {
    name: "Smartphones",
    category: "smartphone",
    image: "/categories/smartphones.jpg",
  },
  {
    name: "Accessories",
    category: "accessories",
    image: "/categories/accessories.jpg",
  },
  { name: "Tablets", category: "tablets", image: "/categories/tablets.jpg" },
];

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#09090F]">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #FF4500 1px, transparent 1px)`,
            backgroundSize: "2.5rem 2.5rem",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[28rem] bg-[#FF4500] opacity-[0.07] blur-[8rem] rounded-full pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative container mx-auto px-6 pt-28 pb-32 text-center"
        >
          <motion.div variants={rise}>
            <span
              data-test="hero-tagline"
              className="inline-block bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] text-xs font-body font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8"
            >
              Premium Mobile Tech
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            data-test="hero-heading"
            className="font-bold text-[#F0EEFF] leading-[1.05] mb-6"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontFamily: "'Big Shoulders Display', sans-serif",
              scaleX: 1.25,
            }}
          >
            The gear you need.
            <span
              data-test="hero-subtitle"
              className="text-[#FF4500]"
              style={{ display: "block", marginTop: "0.5rem" }}
            >
              The signal you send.
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="text-[#7A7A8C] font-body text-lg max-w-xl mx-auto mb-10"
          >
            Smartphones, tablets, and accessories curated for those who demand
            more.
          </motion.p>

          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="user"
                variants={rise}
                className="flex flex-col items-center gap-2"
              >
                <p
                  data-test="welcome-message"
                  className="text-[#F0EEFF] font-display font-bold text-2xl"
                >
                  Welcome back, {user.firstName}.
                </p>
                <p
                  data-test="ready-message"
                  className="text-[#7A7A8C] font-body text-sm"
                >
                  {user.role === "admin"
                    ? "You have full store access."
                    : "Ready to find something new?"}
                </p>
                <motion.div variants={rise} className="mt-4">
                  <Link
                    to="/products"
                    data-test="shop-now-btn"
                    className="inline-block bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-colors"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="guest"
                variants={rise}
                className="flex justify-center gap-4"
              >
                <Link
                  to="/register"
                  data-test="get-started-btn"
                  className="bg-[#FF4500] hover:bg-[#FF6B47] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/products"
                  data-test="browse-btn"
                  className="bg-[#1E1E2C] hover:bg-[#252535] border border-[#252535] text-[#F0EEFF] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-colors"
                >
                  Browse
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="py-20 border-t border-[#252535]">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-test="featured-heading"
            className="font-bold text-[#F0EEFF] text-3xl mb-10"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            Featured
          </motion.h2>
          <FeaturedProducts />
        </div>
      </section>

      <section className="py-20 border-t border-[#252535]">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold text-[#F0EEFF] text-3xl mb-10"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            <span data-test="category-heading">Shop by Category</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${item.category}`}
                  data-test={`category-${item.category}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#252535] hover:border-[#FF4500]/40 transition-all duration-300 block"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/40 to-transparent" />
                  </div>
                  <div className="p-6 bg-[#13131C] group-hover:bg-[#1E1E2C] transition-colors">
                    <h3
                      data-test={`${item.category}-category`}
                      className="font-display font-bold text-[#F0EEFF] text-xl group-hover:text-[#FF4500] transition-colors"
                    >
                      {item.name}
                    </h3>
                    <p className="text-[#7A7A8C] font-body text-sm mt-1">
                      Shop the collection →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
