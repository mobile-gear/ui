import React from "react";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLink = (to: string, label: string) =>
    isActive(to)
      ? "px-4 py-2 rounded-lg bg-[#FF4500] text-white font-display font-bold text-sm tracking-wide"
      : "px-4 py-2 rounded-lg text-[#7A7A8C] hover:text-[#F0EEFF] hover:bg-[#1E1E2C] font-body text-sm font-medium transition-colors";

  return (
    <div className="min-h-screen bg-[#09090F]">
      <nav className="bg-[#13131C] border-b border-[#252535]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 h-14">
            <span className="text-[#7A7A8C] font-body text-xs uppercase tracking-widest mr-4">
              Admin
            </span>
            <Link to="/admin/orders" className={navLink("/admin/orders", "Orders")}>
              Orders
            </Link>
            <Link to="/admin/products" className={navLink("/admin/products", "Products")}>
              Products
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
