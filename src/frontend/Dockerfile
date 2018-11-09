FROM node:8.12.0

ADD ./ /frontend

WORKDIR /frontend

RUN npm --version && npm ci && npm run build
