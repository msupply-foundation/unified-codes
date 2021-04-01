FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/data-loader .
COPY ./data /data
RUN npm install --production
CMD node ./main.js