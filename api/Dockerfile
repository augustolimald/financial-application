FROM node:16.6.1

WORKDIR /usr/app

COPY package.json ./

RUN yarn install 

COPY src ./src
COPY tsconfig.json .

RUN yarn build

EXPOSE 4000
CMD ["yarn", "start"]
