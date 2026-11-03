/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f7fb",
          100: "#e6edf6",
          700: "#1c3554",
          800: "#12263d",
          900: "#0b1a2d",
        },
        brand: {
          400: "#3ec6b8",
          500: "#1aa89a",
          600: "#12887c",
        },
        sand: "#f6efe4",
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px -18px rgba(12, 32, 58, 0.35)",
      },
    },
  },
  plugins: [],
};
