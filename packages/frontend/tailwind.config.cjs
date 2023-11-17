// https://v2.tailwindcss.com/docs

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        neonderthaw: ['"Neonderthaw"', 'monospace'],
        'slackside-one': ['"Slackside One"', 'monospace'],
        kaushan: ['"Kaushan Script"', 'monospace'],
      },
    },
  },
};
