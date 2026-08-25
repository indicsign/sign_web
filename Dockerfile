# Builds the static page and serves it from the document root
# (https://sign.anyserver.site). `vite build` emits relative asset URLs, so the
# same image would also serve correctly from a subpath.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# As a template rather than a finished conf, so the image's envsubst entrypoint
# can substitute ${PORT} before nginx reads it. It renders to
# /etc/nginx/conf.d/default.conf, replacing the packaged one.
COPY nginx.conf /etc/nginx/templates/default.conf.template
# Overridden by the platform wherever the platform assigns the port.
ENV PORT=80
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
