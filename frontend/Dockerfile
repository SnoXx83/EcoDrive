FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json
RUN npm install
COPY public public
COPY eslint.config.mjs eslint.config.mjs
COPY next-env.d.ts next-env.d.ts
COPY next.config.ts next.config.ts
COPY tsconfig.json tsconfig.json
COPY src src


CMD npm run dev