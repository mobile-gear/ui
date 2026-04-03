import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import { loginUser } from "../store/slices/authSlice";
import { loginSchema } from "../utils/schemas/authSchemas";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const { user } = await dispatch(loginUser(values)).unwrap();
        navigate(user.role === "admin" ? "/admin" : "/");
      } catch {
        console.error("Login failed");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#09090F] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10">
          <Link to="/" className="font-display text-2xl font-bold text-[#FF4500] tracking-tight">
            Mobile Gear
          </Link>
          <h1 data-test="login-title" className="mt-6 font-display text-4xl font-bold text-[#F0EEFF] leading-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-[#7A7A8C] font-body">
            Don&apos;t have an account?{" "}
            <Link to="/register" data-test="register-link" className="text-[#FF4500] hover:text-[#FF6B47] transition-colors">
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#9B9BAD] mb-2 font-body">
              Email address
            </label>
            <input
              data-test="login-email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#13131C] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p data-test="email-required-error" className="mt-1.5 text-xs text-[#FF4500] font-body">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#9B9BAD] mb-2 font-body">
              Password
            </label>
            <input
              data-test="login-password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[#13131C] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]"
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <p data-test="password-required-error" className="mt-1.5 text-xs text-[#FF4500] font-body">{formik.errors.password}</p>
            )}
          </div>

          {error && (
            <div className="bg-[#FF4500]/10 border border-[#FF4500]/30 rounded-lg px-4 py-3 text-sm text-[#FF6B47] font-body">
              {error}
            </div>
          )}

          <motion.button
            data-test="login-submit"
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FF4500] hover:bg-[#FF6B47] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold text-sm tracking-widest uppercase py-4 rounded-lg transition-colors mt-2"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
