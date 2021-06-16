#! /bin/bash

pid=$(docker run -p 27018:27017 \
-v "mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro" \
mongo:latest)

echo $pid