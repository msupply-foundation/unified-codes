# Dependencies are installed to a base image to avoid
# having to install these separately for each service
FROM node:current-slim

WORKDIR /usr/unified-codes

COPY package.json .

RUN npm install