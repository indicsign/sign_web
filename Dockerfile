# Builds the static page and serves it from the same subpath it deploys to
# (https://gamepeg.com/full/indicai/). Serving it at the container root would
# 404 every asset, because `vite build` bakes that prefix into the URLs.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/full/indicai
EXPOSE 80
