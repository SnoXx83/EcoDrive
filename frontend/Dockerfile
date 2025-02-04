FROM node:lts-alpine

WORKDIR /app

COPY public public
COPY src src
COPY next-env.d.ts next-env.d.ts
COPY tsconfig.json tsconfig.json
COPY package.json package.json

RUN npm install

CMD npm run dev