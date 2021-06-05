FROM node:14-slim

ENV NODE_ENV="production"

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install && \
    npm cache clean --force

COPY index.js swagger.yaml ./
COPY index.html ./node_modules/swagger-ui-dist/index.html
COPY lib ./lib

EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
