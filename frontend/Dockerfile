FROM node:24

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . /app

EXPOSE 4000

CMD ["npm", "run", "dev"]
