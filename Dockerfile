FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY . .

ENV PORT=80

RUN npx prisma generate

EXPOSE 80

CMD ["npm", "start"]