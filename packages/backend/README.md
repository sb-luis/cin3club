# @private/backend

This is a Node.js backend providing an API to:

- authenticate requests and manage sessions through cookies
- create, read, update and delete users
- search movies and movie details through the [TMDB API](https://developer.themoviedb.org/docs)
- create, read, update and delete user ratings for movies

## getting started

To get started, follow these steps:

1. Install dependencies:

```bash
npm install
```

2. Start the server:

For development with automatic server restart on file changes:

```bash
npm run dev
```

# dependencies

- **[@hapi/hapi](https://www.npmjs.com/package/@hapi/hapi)**: A rich framework for building applications and services.
  - **[@hapi/basic](https://www.npmjs.com/package/@hapi/basic)**: Hapi plugin for basic authentication.
  - **[@hapi/boom](https://www.npmjs.com/package/@hapi/boom)**: HTTP-friendly error objects.
  - **[@hapi/cookie](https://www.npmjs.com/package/@hapi/cookie)**: Cookie parsing and handling.
  - **[@hapi/glue](https://www.npmjs.com/package/@hapi/glue)**: Compose Hapi.js servers and plugins for reusability.
  - **[@hapipal/confidence](https://www.npmjs.com/package/@hapipal/confidence)**: A configuration document format supporting named views.
  - **[@hapipal/haute-couture](https://www.npmjs.com/package/@hapipal/haute-couture)**: File loader and plugin composer for Hapi.js.
  - **[@hapipal/schmervice](https://www.npmjs.com/package/@hapipal/schmervice)**: Service layer for the Hapi.js framework.
  - **[@hapipal/toys](https://www.npmjs.com/package/@hapipal/toys)**: Set of utilities for hapi.js applications.
  - **[hapi-pino](https://www.npmjs.com/package/hapi-pino)**: Hapi plugin for the Pino logger.
- **[pg](https://www.npmjs.com/package/pg)**: PostgreSQL client for Node.js.
  - **[pg-hstore](https://www.npmjs.com/package/pg-hstore)**: A Node package for serializing and deserializing JSON data in and out of PostgreSQL.
  - **[sequelize](https://www.npmjs.com/package/sequelize)**: A promise-based Node.js ORM for PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
  - **[sqlite3](https://www.npmjs.com/package/sqlite3)**: Asynchronous, non-blocking SQLite3 bindings for Node.js.
- **[axios](https://www.npmjs.com/package/axios)**: Promise-based HTTP client for the browser and Node.js.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: A library to help you hash passwords.
- **[joi](https://www.npmjs.com/package/joi)**: Object schema description language and validator for JavaScript objects.
- **[exiting](https://www.npmjs.com/package/exiting)**: Simplified exit management for Node.js applications.

## Development Dependencies

- **[eslint](https://www.npmjs.com/package/eslint)**: A pluggable and configurable linter tool for identifying and fixing problems in JavaScript code.
  - **[@babel/core](https://www.npmjs.com/package/@babel/core)**: Babel compiler core.
  - **[@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)**: Babel parser for ESLint.
  - **[@hapi/eslint-plugin](https://www.npmjs.com/package/@hapi/eslint-plugin)**: Hapi-specific ESLint rules.
  - **[eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node)**: Additional ESLint rules for Node.js.
  - **[eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)**: ESLint plugin for Prettier formatting.
    - **[@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch)**: ESLint patch for monorepos.
    - **[eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)**: Turns off all rules that are unnecessary or might conflict with Prettier.
- **[prettier](https://www.npmjs.com/package/prettier)**: Opinionated code formatter.
- **[@hapipal/hpal](https://www.npmjs.com/package/@hapipal/hpal)**: Command-line interface for Hapi Pal (Plugin Architecture).
  - **[blipp](https://www.npmjs.com/package/blipp)**: Simple hapi plugin to display the routes table at startup.
  - **[@hapipal/hpal-debug](https://www.npmjs.com/package/@hapipal/hpal-debug)**: Debug support for Hapi Pal.
  - **[pino-pretty](https://www.npmjs.com/package/pino-pretty)**: Fast and simple pretty print for Pino log format.
- **[nodemon](https://www.npmjs.com/package/nodemon)**: Monitor for any changes in your node.js application and automatically restart the server.
