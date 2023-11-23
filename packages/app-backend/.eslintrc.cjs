// required for eslint to resolve @your-company/eslint-config in the extends arr
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    node: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', , 'plugin:node/recommended', 'plugin:@hapi/recommended', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
  },
  rules: {
    'space-before-function-paren': 0,
    'prettier/prettier': 'error',
  },
};
