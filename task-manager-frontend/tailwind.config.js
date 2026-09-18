/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14171C',
          soft: '#20242B',
          muted: '#5B5F58',
        },
        paper: {
          DEFAULT: '#E9EBE4',
          light: '#F4F5F0',
          line: '#D3D6CC',
        },
        stamp: {
          DEFAULT: '#C98A2B',
          dark: '#A16D1F',
          light: '#E8C078',
        },
        wax: {
          DEFAULT: '#A8342A',
          light: '#F1DAD7',
        },
        ledger: {
          DEFAULT: '#2F5233',
          light: '#DCE6DC',
        },
      },
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(20, 23, 28, 0.06)',
      },
    },
  },
  plugins: [],
};
