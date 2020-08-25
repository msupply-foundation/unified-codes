# Remove old container if one exists
docker rm --force data-service

docker run --publish 4000:4000 --detach --name data-service unified-codes/data-service:latest