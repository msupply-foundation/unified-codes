#!/usr/bin/env bash

echo " * Launching dgraph container..."
if [ "$OSTYPE" == "msys" ]; then
    winpty docker run --rm -p 8080:8080 -p 9080:9080 -p 8000:8000 -v ~/dgraph:/dgraph dgraph/standalone:v23.1.0
else
    docker run --rm -p 8080:8080 -p 9080:9080 -p 8000:8000 -v ~/dgraph:/dgraph dgraph/standalone:v23.1.0
fi