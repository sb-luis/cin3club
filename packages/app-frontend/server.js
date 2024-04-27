// VUE SSR docs: https://vuejs.org/guide/scaling-up/ssr.html
// VITE SSR docs: https://vitejs.dev/guide/ssr
// vue example on vite's docs: https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue

// In the future I could consider upgrading this setup to Nuxt or Vike

// --- CSS flicker bug on production ---

// Related to the flash of unstyled css
// https://github.com/vitejs/vite/issues/2013
// https://discord.com/channels/804011606160703521/804061937029218334/814909610372366346
// Discussion with Evan Yu and Rich Harris - https://discord.com/channels/804011606160703521/804061937029218334/810901252862509067

// Also relevant the `getPreloadTags` function exported here: https://github.com/vikejs/vike/blob/9e0b1771baa0234aef0ea10605e4a48702806bd3/src/getPreloadTags.node.ts - but this is quite outdated...

// Relevant about Vike's preloading strategies: https://vike.dev/preload

import fs from 'node:fs/promises';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer } from 'node:http';
import { createSocketServer } from './socket/server.js';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : '';
const ssrManifest = isProduction ? await fs.readFile('./dist/client/ssr-manifest.json', 'utf-8') : undefined;

// Create http server
const app = express();
const server = createServer(app);

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  console.log('Running development vite server');
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { host: '0.0.0.0', middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Proxy middleware for the Backend API
// For all routes starting with /api
const apiProxy = createProxyMiddleware('/api', {
  target: `${process.env.BACKEND_URL}`,
  // Changes the origin of the host header to the target URL
  changeOrigin: true,
});

app.use('/api', apiProxy);

// Initialise socket io server
createSocketServer(server);

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');
    const { lang = 'en' } = req.query;

    let template;
    let render;
    if (!isProduction) {
      console.log('Server Rendering Development App');
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render;
    } else {
      console.log('Server Rendering Production App');
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render({ path: url, lang }, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.headHtml ?? '')
      .replace(`<!--app-html-->`, rendered.bodyHtml ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
