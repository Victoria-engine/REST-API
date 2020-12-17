FROM node:12-alpine

# Create app directory and use it for the current work dir
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

COPY . /usr/src/server/
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]