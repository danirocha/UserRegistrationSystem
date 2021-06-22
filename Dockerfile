FROM node:15.10.0-alpine

WORKDIR /app

RUN mkdir /node_modules

# specify the path for node
ENV NODE_PATH /node_modules

# copy package.json separately to use docker cache
COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

CMD npm start