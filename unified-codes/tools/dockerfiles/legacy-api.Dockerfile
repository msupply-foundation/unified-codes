FROM node:current-slim

WORKDIR /usr/unified-codes

EXPOSE 3000

# This separation allows us to utilise docker's caching 
# i.e. stop npm install re-pulling unless there are package.json changes
COPY package.json .

RUN npm install

COPY . .

WORKDIR /usr/unified-codes/dist/apps/legacy-api/app

CMD [ "node", "main.js" ]