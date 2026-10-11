/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#651D32',
          dark: '#3B1020',
          light: '#802640',
        },
        champagne: {
          DEFAULT: '#C6A15B',
          light: '#DFC58A',
          dark: '#9F7C38',
        },
        warmIvory: {
          DEFAULT: '#FFF9F1',
          light: '#FFFFFF',
          dark: '#F7EFE4',
        },
        softRose: {
          DEFAULT: '#E8C9C7',
          light: '#F5E4E3',
        },
        mutedTaupe: {
          DEFAULT: '#A69A90',
          light: '#C8BFB7',
        },
        mainText: '#282323',
        secondaryText: '#716963',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', '"Manrope"', 'sans-serif'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
      }
    },
  },
  plugins: [],
}
