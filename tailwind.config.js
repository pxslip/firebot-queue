/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/queues/manager/templates/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
