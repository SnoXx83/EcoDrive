FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY config config
COPY tsconfig.json tsconfig.json
COPY src src

RUN apk add --no-cache curl

CMD npm start
