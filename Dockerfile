FROM node:latest as dev

RUN ln -s /usr/bin/python3 /usr/bin/python
RUN npm i -g pnpm
WORKDIR /app

FROM node:alpine as builder

RUN npm i -g pnpm
RUN apk add --no-cache python3 make g++
RUN ln -s /usr/bin/python3 /usr/bin/python
WORKDIR /app

COPY . .
RUN pnpm i && pnpm build && rm -rf node_modules && pnpm i --prod

FROM node:alpine as prod

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT [ "node", "packages/test/dist/index.js" ]
