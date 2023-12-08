// VUE SSR docs: https://vuejs.org/guide/scaling-up/ssr.html
// VITE SSR docs: https://vitejs.dev/guide/ssr
// VIKE docs: https://vike.dev/
// ---- ---- ---- ----
// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + Vike examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.github.io/) to scaffold a Vike + HatTip app. Note that Bati generates apps that use the V1 design (https://vike.dev/migration/v1-design) and Vike packages (https://vike.dev/vike-packages)

// --- START CSS flicker bug on production ---

// Related to the flash of unstyled css
// https://github.com/vitejs/vite/issues/2013
// https://discord.com/channels/804011606160703521/804061937029218334/814909610372366346
// Discussion with Evan Yu and Rich Harris - https://discord.com/channels/804011606160703521/804061937029218334/810901252862509067

// Also relevant the `getPreloadTags` function exported here: https://github.com/vikejs/vike/blob/9e0b1771baa0234aef0ea10605e4a48702806bd3/src/getPreloadTags.node.ts - but this is quite outdated...

// Relevant about Vike's preloading strategies: https://vike.dev/preload

// --- END CSS flicker bug on production ---

import express from 'express';
import compression from 'compression';
import { renderPage } from 'vike/server';
import { root } from './root.js';
const isProduction = process.env.NODE_ENV === 'production';

startServer();

async function startServer() {
  const app = express();

  app.use(compression());

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) {
      return next();
    } else {
      const { body, statusCode, headers, earlyHints } = httpResponse;
      if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
      headers.forEach(([name, value]) => res.setHeader(name, value));
      res.status(statusCode);
      // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
      res.send(body);
    }
  });

  const port = process.env.PORT || 8000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
