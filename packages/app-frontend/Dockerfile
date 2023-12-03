# --- BASE ---
FROM node:current-alpine3.18 AS base
# all of our code will live in `/app`
WORKDIR /app
# copy package json and install deps
COPY package*.json ./
RUN npm i
# copy our app
COPY . .

# --- DEVELOPMENT ---
FROM base AS dev 
# expose port to access server
EXPOSE 8000
# run app
CMD ["npm", "run", "dev"]

# --- BUILD ---
FROM base as build
# build a production-ready artifact
RUN npm run build

# --- PRODUCTION ---
# production stage
#FROM nginx:stable-alpine as prod 
#COPY --from=build /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]