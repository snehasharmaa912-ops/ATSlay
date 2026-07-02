/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        accent: "#6366f1",
        good: "#22c55e",
        warn: "#f59e0b",
        bad: "#ef4444",
      },
    },
  },
  plugins: [],
};
