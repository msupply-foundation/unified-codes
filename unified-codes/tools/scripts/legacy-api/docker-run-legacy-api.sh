# Remove old container if one exists
docker rm --force legacy-api

docker run --publish 3000:3000 --detach --name legacy-api unified-codes/legacy-api:latest