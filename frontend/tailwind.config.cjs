module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        background: "#040B16",
        surface: "#0B1121",
        surfaceHover: "#111827",
        primary: {
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        accent: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        danger: {
          500: "#ef4444",
        },
        success: {
          500: "#10b981",
        },
        warning: {
          500: "#f59e0b",
        }
      },
      boxShadow: {
        glass: "0 20px 48px rgba(4, 11, 22, 0.6)",
        'glass-sm': "0 8px 32px rgba(4, 11, 22, 0.4)",
        glow: "0 0 20px rgba(59, 130, 246, 0.35)",
        'accent-glow': "0 0 24px rgba(139, 92, 246, 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "glow-pulse": "glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
