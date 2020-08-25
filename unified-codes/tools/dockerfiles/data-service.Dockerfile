FROM katms-unified-codes-dependencies:latest

EXPOSE 4000

WORKDIR /usr/unified-codes/dist/apps/data-service

COPY /dist/apps/data-service .

CMD [ "node", "main.js" ]