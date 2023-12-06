// "entry-client.js"
// mounts the app to a DOM element

import { createApp } from './main.js';

const { app, router } = createApp();

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app');
});
