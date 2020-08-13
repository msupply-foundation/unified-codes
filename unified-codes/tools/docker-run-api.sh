# Remove old container if one exists
docker rm --force api

docker run --publish 3000:3000 --detach --name api api:0.1