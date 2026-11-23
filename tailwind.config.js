/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "pattu silk at midnight": plum silk, zari gold, her lavender, kumkum red for hearts only
        velvet: { 950: '#110818', 900: '#170C21', 800: '#1F1029', 700: '#2A1636' },
        lavender: { DEFAULT: '#BBA6D9', bright: '#CDB8F0', soft: '#F1E9F6' },
        champagne: { DEFAULT: '#E2C07E', deep: '#B8893E' },
        rose: { glow: '#E7A3B4' },
        heart: { DEFAULT: '#E0435C', deep: '#B51F3D', soft: '#F08A9B' },
      },
      fontFamily: {
        // headings: DM Serif Display · reading text: DM Serif Text · names: DM Serif Display italic · UI: Manrope
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        book: ['"DM Serif Text"', 'Georgia', 'serif'],
        script: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(187,166,217,0.4)',
        gold: '0 0 50px -10px rgba(226,192,126,0.5)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
