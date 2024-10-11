# Use the official Node.js image as the base image
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]