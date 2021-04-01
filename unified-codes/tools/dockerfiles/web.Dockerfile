FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/web .
EXPOSE 4200
RUN npm install --production
CMD node ./main.js