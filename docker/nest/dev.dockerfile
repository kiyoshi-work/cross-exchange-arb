FROM node:18.15.0
RUN mkdir -p /home/node/workspace/node_modules && chown -R node:node /home/node/workspace

WORKDIR /home/node/workspace

COPY --chown=node:node package*.json ./

USER node

RUN npm install --verbose

#RUN npm ci
# run this for production
# npm ci --only=production

COPY --chown=node:node . .