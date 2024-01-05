FROM node:18.15.0-slim

WORKDIR /app

COPY ./dist/package.json .
RUN npm install --production

COPY ./dist .

CMD node ./main.js
