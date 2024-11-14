FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "start" , "--host", "0.0.0.0", "--port", "8080"]