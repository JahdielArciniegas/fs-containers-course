FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV VITE_BACKEND_URL=/api

FROM base AS test

ENV NODE_ENV=test
ENV CI=true

RUN npm run test

FROM base AS build

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]