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

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /szzti/dist/szzti-frontend /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
