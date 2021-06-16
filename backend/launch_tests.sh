#! /bin/bash

pid=$(docker run -p 27018:27017 \
-v "init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro" \
mongo:latest)

echo $pid