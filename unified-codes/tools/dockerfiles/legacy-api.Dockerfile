FROM unified-codes/dependencies:latest

EXPOSE 3000

WORKDIR /usr/unified-codes/dist/apps/legacy-api

COPY /dist/apps/legacy-api .

CMD [ "node", "main.js" ]