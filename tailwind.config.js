module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
    // eslint-disable-next-line global-require
    require('@tailwindcss/typography'),
  ],
};
