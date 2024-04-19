// "entry-client.js"
// mounts the app to a DOM element

import { createApp } from './main.js';

// We only initialise the socket-io client on the client-side JS
const socket = io();
const { app, router } = createApp({ socket });

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app');
});
