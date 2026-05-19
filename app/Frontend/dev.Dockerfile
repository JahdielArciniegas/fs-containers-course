FROM node:22.20.0-alpine as dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]