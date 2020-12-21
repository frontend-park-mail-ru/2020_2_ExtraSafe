#!/bin/sh
set -e

NODEJSIMAGE="35dergachev/tabutask_frontend_nodejs"
NGINXIMAGE="35dergachev/tabutask_frontend_nginx"
GIT_VERSION=$(git describe --always --abbrev --tags --long)

cd deploy/nodejs
docker build -t ${NODEJSIMAGE}:${GIT_VERSION} .
docker tag ${NODEJSIMAGE}:${GIT_VERSION} ${NODEJSIMAGE}:latest

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${NODEJSIMAGE}:${GIT_VERSION}

cd ../deploy/nginx
docker build -t ${NGINXIMAGE}:${GIT_VERSION} .
docker tag ${NGINXIMAGE}:${GIT_VERSION} ${NGINXIMAGE}:latest

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${NGINXIMAGE}:${GIT_VERSION}

ssh -${SSH_KEY} ubuntu@95.163.213.142
