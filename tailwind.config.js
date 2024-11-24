/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash': 'dash 1.5s ease-in-out infinite',
      },
      keyframes: {
        dash: {
          '0%': { strokeDashoffset: '283' },
          '50%': { strokeDashoffset: '70' },
          '100%': { strokeDashoffset: '283' },
        },
      },
    },
  },
  plugins: [],
}