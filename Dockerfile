### STAGE 1: Build ###

FROM node:10-alpine as builder

RUN mkdir /szzti

WORKDIR /szzti

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build-prod


### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

COPY nginx/default.conf /etc/nginx/conf.d/

COPY run.sh /run.sh

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /szzti/dist/szzti-frontend /usr/share/nginx/html

RUN chmod +x run.sh

CMD ["/bin/sh", "run.sh"]
