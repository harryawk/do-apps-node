FROM node:10

WORKDIR /app

COPY package.json /app

RUN touch /app/.env

ARG MONGO_URI
RUN echo ${MONGO_URI}
RUN echo DB_URI=${MONGO_URI} > /app/.env

ARG DO_ACCESS_KEY_ID
RUN echo DO_ACCESS_KEY_ID=${DO_ACCESS_KEY_ID} >> /app/.env
ARG DO_ACCESS_KEY_SECRET
RUN echo DO_ACCESS_KEY_SECRET=${DO_ACCESS_KEY_SECRET} >> /app/.env

ARG AUTH_SECRET
RUN echo AUTH_SECRET=${AUTH_SECRET} >> /app/.env

RUN cat /app/.env

RUN npm install

# RUN npm i pm2 -g

COPY . /app

# CMD pm2-runtime server.js
CMD node index.js

EXPOSE 9999