# docker build --tag api:0.1 -f api.Dockerfile .

FROM node:current-slim

WORKDIR /usr

EXPOSE 3000

COPY . .

RUN npm install

WORKDIR /usr/dist/apps/api/app

CMD [ "node", "main.js" ]