# --- BASE ---
FROM node:current-alpine3.18 AS base

# install all apk dependencies 
# `dumb-init` handles being pid 1 and forwarding signals
RUN apk add --update dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Set WORKDIR to /home/node 
# And user to 'node' 
# As the permissions here as set up correctly for 'node' user
# https://github.com/nodejs/docker-node/issues/740#issuecomment-458545074
WORKDIR /home/node
USER node

# --- BUILD ---
FROM base  AS build 
# install all node dependencies
COPY --chown=node:node package*.json ./
RUN npm set progress=false \
    && npm config set depth 0 \
    && npm i 

# copy our app source code
COPY --chown=node:node . .

# build a production-ready artifact
RUN npm run build

EXPOSE 8000

# --- TEST ---
FROM build AS test
ENV NODE_ENV=test
# use `sh -c` so we can chain test commands using `&&`
CMD ["npm", "test"]

# --- DEVELOPMENT ---
FROM build AS dev 
# expose port to access server

ENV NODE_ENV=development
CMD ["npm", "run", "dev:docker"]

# --- PRODUCTION ---
FROM build AS prod 
ENV NODE_ENV=production

# prune non-prod deps
RUN npm prune --production 
# remove non-prod files 
RUN rm ./.eslintrc.cjs 
RUN rm ./postcss.config.cjs 
RUN rm ./tailwind.config.cjs 

CMD ["npm", "start"]