FROM node:10-slim

ENV NODE_ENV="production"

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
RUN yarn install && \
    yarn cache clean

COPY index.js swagger.yaml ./
COPY index.html ./node_modules/swagger-ui-dist/index.html
COPY lib ./lib

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
