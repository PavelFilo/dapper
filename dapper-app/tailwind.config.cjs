/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    colors: {
      blue: '#189AB4',
      dark: '#05445E',
      green: '#75E6DA',
      soft: '#D4F1F4',
      white: '#FFFFFF',
      // TXT
      'gray-dark': '#273444',
      gray: '#8492a6',
      'gray-light': '#d3dce6',
    },
    extend: {
      width: {
        100: '24rem',
      },
      zIndex: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
        900: '900',
        1000: '1000',
      },
    },
  },
  plugins: [],
}
