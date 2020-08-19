FROM unified-codes/dependencies:latest

EXPOSE 4000

COPY /dist/apps/data-service .

WORKDIR /usr/unified-codes/dist/apps/data-service

CMD [ "node", "main.js" ]