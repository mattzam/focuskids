/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ff6933",
        "accent-yellow": "#FFD166",
        "accent-green": "#06D6A0",
        "bg-light": "#f8f9fa",
        "bg-dark": "#23140f",
      },
      fontFamily: {
        display: ["Fredoka One", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-fast": "pulse 0.8s infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "star-pop": "starPop 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        confetti: "confettiFall 1s ease-in forwards",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        starPop: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "70%": { transform: "scale(1.3) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
