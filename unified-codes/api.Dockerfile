FROM node:current-slim

WORKDIR /usr/unified-codes

EXPOSE 3000

COPY . .

RUN npm install

WORKDIR /usr/unified-codes/dist/apps/api/app

CMD [ "node", "main.js" ]