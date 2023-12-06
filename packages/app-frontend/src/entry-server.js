// "entry-server.js"
// renders the app using the framework's SSR API
// In this case VueJS

import { createApp } from './main.js';
import { renderToString } from 'vue/server-renderer';

export async function render(options = {}, ssrManifest) {
  const { app, router } = createApp(options);
  const { path } = options;

  // set the router to the desired URL before rendering
  router.push(path);
  await router.isReady();

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {};
  const bodyHtml = await renderToString(app, ctx);
  const headHtml = '';

  // the SSR manifest generated by Vite contains contains mappings of module IDs to their associated chunks and asset files
  // https://vitejs.dev/guide/ssr#generating-preload-directives

  return { bodyHtml, headHtml };
}
