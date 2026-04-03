import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logoutUser } from "../store/slices/authSlice";
import { AppDispatch } from "../store";
import { BsCart3, BsChevronDown } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setIsDropdownOpen(false);
  };

  return (
    <nav data-test="navbar" className="bg-[#13131C] border-b border-[#252535]">
      <div className="container mx-auto flex justify-between items-center px-6 h-16">
        <Link
          to="/"
          className="font-display font-bold text-xl tracking-tight text-[#F0EEFF] hover:text-[#FF4500] transition-colors"
        >
          Mobile<span className="text-[#FF4500]">Gear</span>
        </Link>

        <div className="flex items-center gap-7">
          <Link
            to="/products"
            className="text-[#7A7A8C] hover:text-[#F0EEFF] font-body text-sm font-medium transition-colors"
          >
            Products
          </Link>

          <Link to="/cart" data-test="cart-link" className="relative text-[#7A7A8C] hover:text-[#F0EEFF] transition-colors">
            <BsCart3 className="text-xl" />
            <AnimatePresence>
              {items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  data-test="cart-badge"
                  className="absolute -top-2 -right-2 bg-[#FF4500] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold font-body"
                >
                  {items.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-[#7A7A8C] hover:text-[#F0EEFF] font-body text-sm font-medium transition-colors"
              >
                <span>{user?.firstName}</span>
                <BsChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-44 bg-[#1E1E2C] border border-[#252535] rounded-xl shadow-xl py-1 z-50 overflow-hidden"
                  >
                    <Link
                      to="/orders"
                      className="block px-4 py-2.5 text-sm text-[#9B9BAD] hover:text-[#F0EEFF] hover:bg-[#252535] font-body transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2.5 text-sm text-[#9B9BAD] hover:text-[#F0EEFF] hover:bg-[#252535] font-body transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-[#FF4500] hover:bg-[#252535] font-body transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-[#7A7A8C] hover:text-[#F0EEFF] font-body text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#FF4500] hover:bg-[#FF6B47] text-white font-body text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
