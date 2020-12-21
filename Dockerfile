FROM node:12-alpine

COPY . /app

WORKDIR /app

RUN npm ci --only-production
RUN npm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
