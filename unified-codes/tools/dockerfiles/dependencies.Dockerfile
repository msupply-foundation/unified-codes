# Dependencies are installed to a base image to avoid
# having to install these separately for each service
FROM node:10.15

WORKDIR /usr/unified-codes

COPY package.json .

RUN npm install