FROM node:17-alpine AS dev

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .

EXPOSE 8080
ENV PORT 8080

ENTRYPOINT ["yarn", "run", "dev"]

FROM node:16-alpine AS staging

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ARG PROD_ENV=""

COPY . .

RUN printf "$PROD_ENV" >> .env.production

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
ENV PORT 8080

ENTRYPOINT ["yarn", "run", "start"]

FROM node:16-alpine AS prod

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ARG PROD_ENV=""

COPY . .

RUN printf "$PROD_ENV" >> .env.production

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
ENV PORT 8080

ENTRYPOINT ["yarn", "run", "start"]

