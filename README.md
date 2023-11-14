# Vue3 + Hapi + PostgreSQL boilerplate

- [vue 3 site](https://vuejs.org/guide/quick-start.html)
- [hapi site](https://hapi.dev/)
- [postgresql site](https://www.postgresql.org/)

## Getting started

- Copy `/packages/api/env-example` to `/packages/api/.env`
- Run with Docker compose `docker compose up --build`
- Access the frontend from `http://localhost:8000`

## Architecture

```
      ui                          api                        data
[vue3 frontent] <-- HTTP --> [hapi backend] <-- TCP --> [postgresql db]
```

## Best practices

[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Docker setup

Highly based on the 'flavor-docker' brach of [hapipal/boilerplate](https://github.com/hapipal/boilerplate/tree/flavor-docker)

This [Dockerfile](./Dockerfile) uses [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) to create different Docker images depending on the environment the images will be running in, while ensuring best practices are followed to keep image size low and create a security sandbox if you are running a server.

### non-root user

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user

`USER NODE` user is created in base node image, we want to use this **non-root user** to prevent the server from one attack vector

### environment variables

This template no longer use `.env` files, as it is safer to start the container declaring
the environment variables in either the `docker-compose.yml` file or via the `docker` cli.

If you need to add any environment variables, you can do so in the `docker-compose.yml`
files as shown, or add them to `.env` and load them in as shown
[here](https://docs.docker.com/compose/compose-file/#env_file).

If you have true secrets that you need locally and cannot check into Git, you can re-create the `server/.env` file, and then add a key in the `*_base` services in `docker-compose.yml` that is simply `env_file: server/.env` at the same level in the yaml as the `environment` key.

### stages

There are currently five stages in the Dockerfile that are used.

##### `base`

Contains all package installs, files system modifications, and entrypoint declaration.
Any commands that will not change across the other stages or are required for multiple
other stages to execute properly should be put in this stage.

##### `build`

Used to install npm dependencies, copy all of your source files, and then optionally run any build commands that need to be executed. The desired outcome of this stage is an image that contains all dependencies, all source files, and all built assets (if necessary).

In order to run build scripts, you will need to locate this stage in the Dockerfile and uncomment the `RUN npm run build` command that is in there, possibly changing the command if you are using multiple build scripts in your `package.json`.

##### `test`

Used for running your test suite. It changes the user to `node` to mimic the production environment, and then runs `npm lint && npm test` which should run your full test suite.

##### `dev`

Meant to run your server locally with dev deps installed, and hot module reloading.

##### `prod`

Meant to run your server in a production-like setup without dev deps.
