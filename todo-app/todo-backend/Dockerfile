FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

USER node

EXPOSE 3000

CMD npm run dev
