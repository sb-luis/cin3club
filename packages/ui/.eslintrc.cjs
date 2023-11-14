// required for eslint to resolve @your-company/eslint-config in the extends arr
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    es6: true,
  },
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:vue/vwe3-recommended', '@vue/eslint-config-prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
