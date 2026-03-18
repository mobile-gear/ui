/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Figtree", "sans-serif"],
      },
      colors: {
        obsidian: {
          950: "#09090F",
          900: "#13131C",
          800: "#1E1E2C",
          700: "#252535",
        },
        signal: {
          DEFAULT: "#FF4500",
          light: "#FF6B47",
          dim: "rgba(255,69,0,0.15)",
        },
        ink: "#F0EEFF",
        muted: "#7A7A8C",
        border: "#252535",
      },
    },
  },
  plugins: [],
};
