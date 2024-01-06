FROM node:18.15.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.15.0 AS runner
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE

ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_DATABASE $DB_DATABASE

ENV CORS_ORIGIN http://localhost:3000,$CORS_ORIGIN
ENV DB_SYNC 1

ENV PORT 8080

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install --production
USER node
EXPOSE 8080
# COPY --from=builder --chown=node:node /app/ecosystem.config.js  .
COPY --from=builder --chown=node:node /app/dist  .
COPY --from=builder --chown=node:node /app/scripts  ./scripts
CMD ["npm", "run", "start:prod"]