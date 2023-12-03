// https://v2.tailwindcss.com/docs

const colorRadix = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  neutralDark: {
    50: '#0a0a0a',
    100: '#171717',
    200: '#262626',
    300: '#404040',
    400: '#525252',
    500: '#737373',
    600: '#a3a3a3',
    700: '#d4d4d4',
    800: '#e5e5e5',
    900: '#f5f5f5',
    950: '#fafafa',
  },
  cyan: {
    100: '#fafdfe',
    200: '#f2fcfd',
    300: '#e7f9fb',
    400: '#d8f3f6',
    500: '#c4eaef',
    600: '#aadee6',
    700: '#84cdda',
    800: '#3db9cf',
    900: '#05a2c2',
    950: '#0894b3',
    11: '#0c7792',
    12: '#04313c',
  },
  cyanDark: {
    100: '#07191d',
    200: '#061e24',
    300: '#072830',
    400: '#07303b',
    500: '#073844',
    600: '#064150',
    700: '#045063',
    800: '#00647d',
    900: '#05a2c2',
    950: '#00b1cc',
    11: '#00c2d7',
    12: '#e1f8fa',
  },
};

const themes = {
  themes: [
    {
      // Base theme
      name: 'base',
      selectors: [':root'],
      theme: {
        colors: {
          // light by default
          neutral: colorRadix.neutral,
          primary: colorRadix.cyan,
        },
        borderRadius: {
          none: '0',
          sm: '0.125rem',
          DEFAULT: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px',
        },
      },
    },
    {
      selectors: ['.dark'],
      // darkMode theme
      theme: {
        colors: {
          neutral: colorRadix.neutralDark,
          primary: colorRadix.cyanDark,
        },
      },
    },
    {
      // A class to remove any border-radius from elements!
      selectors: ['.square'],
      theme: {
        borderRadius: {
          sm: '0',
          DEFAULT: '0',
          md: '0',
          lg: '0',
          xl: '0',
          '2xl': '0',
          '3xl': '0',
          full: '0',
        },
      },
    },
  ],
};

module.exports = {
  darkMode: 'class', // https://tailwindcss.com/docs/dark-mode
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // https://tailwindcss.com/docs/theme
    extend: {
      screens: {
        sm: '480px', // was 640
        md: '640px', // was 768
        lg: '1024px',
      },
    },
  },
  // Plugin DOCS
  // https://github.com/crswll/tailwindcss-theme-swapper
  plugins: [require('tailwindcss-theme-swapper')(themes)],
};
