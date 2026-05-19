FROM node:22.20.0-alpine as prod

WORKDIR /app

COPY package*.json .

RUN npm ci

USER node

COPY . .

CMD ["npm", "start"]

