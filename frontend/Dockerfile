FROM node:lts-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package.json
RUN npm install
COPY public public
COPY eslint.config.mjs eslint.config.mjs
COPY next.config.ts next.config.ts
COPY tsconfig.json tsconfig.json
COPY src src


RUN npm run dev
