// "entry-client.js"
// mounts the app to a DOM element
import { createApp } from './main.js';

const render = async () => {
  const { app, router } = await createApp();

  // wait until router is ready before mounting to ensure hydration match
  router.isReady().then(() => {
    app.mount('#app');
  });
};

render();
