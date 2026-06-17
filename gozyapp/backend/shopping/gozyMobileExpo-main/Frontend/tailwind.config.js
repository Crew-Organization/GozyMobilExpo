/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gozyRed: '#EC1746',
        gozyPink: '#EF3F68',
        gozyGreen: '#00A86B',
        gozyPurple: '#6E27D9',
      },
    },
  },
  plugins: [],
};
