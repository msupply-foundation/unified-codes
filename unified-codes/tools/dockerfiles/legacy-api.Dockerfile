FROM unified-codes/dependencies:latest

EXPOSE 3000

WORKDIR /usr/unified-codes/dist/apps/legacy-api/app

COPY /dist/apps/legacy-api/app .

CMD [ "node", "main.js" ]