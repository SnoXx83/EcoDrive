FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

RUN npm run start

# FROM node:lts-alpine as runner

# RUN apk add --no-cache curl

# WORKDIR /app

# COPY --from=builder /app/dist /app/dist

# COPY package.json package.json
# RUN npm install --omit-dev


# CMD npm run startprod
