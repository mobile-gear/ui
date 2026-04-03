import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import { registerUser } from "../store/slices/authSlice";
import { registerSchema } from "../utils/schemas/authSchemas";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(
          registerUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          }),
        ).unwrap();
        navigate("/login");
      } catch {
        console.error("Registration failed");
      }
    },
  });

  const fields: Array<{
    id: keyof typeof formik.values;
    label: string;
    type: string;
    placeholder: string;
    autoComplete?: string;
  }> = [
    { id: "firstName", label: "First name", type: "text", placeholder: "John" },
    { id: "lastName", label: "Last name", type: "text", placeholder: "Doe" },
    {
      id: "email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Min. 8 characters",
      autoComplete: "new-password",
    },
    {
      id: "confirmPassword",
      label: "Confirm password",
      type: "password",
      placeholder: "Repeat your password",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090F] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-10">
          <Link
            to="/"
            className="font-display text-2xl font-bold text-[#FF4500] tracking-tight"
          >
            Mobile Gear
          </Link>
          <h1
            data-test="register-title"
            className="mt-6 font-display text-4xl font-bold text-[#F0EEFF] leading-tight"
          >
            Create account
          </h1>
          <p className="mt-2 text-[#7A7A8C] font-body">
            Already have an account?{" "}
            <Link
              to="/login"
              data-test="sign-in-link"
              className="text-[#FF4500] hover:text-[#FF6B47] transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form
          data-test="register-form"
          onSubmit={formik.handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-[#9B9BAD] mb-2 font-body"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formik.values[field.id]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-[#13131C] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]"
                />
                {formik.touched[field.id] && formik.errors[field.id] && (
                  <p
                    data-test={`${field.id}-error`}
                    className="mt-1.5 text-xs text-[#FF4500] font-body"
                  >
                    {formik.errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {fields.slice(2).map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-[#9B9BAD] mb-2 font-body"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={formik.values[field.id]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#13131C] border border-[#252535] text-[#F0EEFF] rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF4500] transition-colors placeholder-[#3A3A4A]"
              />
              {formik.touched[field.id] && formik.errors[field.id] && (
                <p className="mt-1.5 text-xs text-[#FF4500] font-body">
                  {formik.errors[field.id]}
                </p>
              )}
            </div>
          ))}

          {error && (
            <div className="bg-[#FF4500]/10 border border-[#FF4500]/30 rounded-lg px-4 py-3 text-sm text-[#FF6B47] font-body">
              {error}
            </div>
          )}

          <motion.button
            data-test="register-submit"
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#FF4500] hover:bg-[#FF6B47] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold text-sm tracking-widest uppercase py-4 rounded-lg transition-colors mt-2"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
