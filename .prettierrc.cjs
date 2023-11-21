module.exports = {
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 120,
  trailingComma: 'all',
  endOfLine: 'auto',
  // automatic sorting of tailwind classes
  // following the order they appear in the CSS
  // https://tailwindcss.com/blog/automatic-class-sorting-with-prettier
  plugins: ['prettier-plugin-tailwindcss'],
};
