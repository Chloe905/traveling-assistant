/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        morandi: {
          mist: '#f6f4ef',
          linen: '#ebe4d8',
          sage: '#9cae9b',
          sageDark: '#667866',
          blue: '#9aa9b5',
          rose: '#c8a6a0',
          clay: '#b39b89',
          ink: '#3f4742'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(63, 71, 66, 0.10)'
      }
    }
  },
  plugins: []
}
