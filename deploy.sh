#!/bin/sh
set -e

IMAGE="35dergachev/tabutask_frontend"
GIT_VERSION=$(git describe --always --abbrev --tags --long)

docker build -t ${IMAGE}:${GIT_VERSION} .
docker tag ${IMAGE}:${GIT_VERSION} ${IMAGE}:latest

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${IMAGE}:${GIT_VERSION}


ssh -${SSH_KEY} ubuntu@95.163.213.142
docker pull ${IMAGE}:${GIT_VERSION}

CONTAINER_ID=$(docker ps | grep takenote | cut -d" " -f1)

docker stop ${CONTAINER_ID}
docker run --restart unless-stopped -d -p 80:5000 ${IMAGE}:${GIT_VERSION}
docker system prune -a -f
