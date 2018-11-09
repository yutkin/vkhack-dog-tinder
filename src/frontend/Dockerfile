FROM node:latest

ADD ./ /frontend

WORKDIR /frontend

RUN npm ci && npm run build
