# Build all docker images
docker build --rm --tag unified-codes/dependencies:latest -f ../dockerfiles/dependencies.Dockerfile ../..
docker build --rm --tag unified-codes/data-service:latest -f ../dockerfiles/data-service.Dockerfile ../..