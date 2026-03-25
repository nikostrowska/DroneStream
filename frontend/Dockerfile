FROM node:24-alpine

WORKDIR /app
ENV BACKEND_HOSTNAME="backend"
COPY package*.json .
RUN npm install
COPY . /app

EXPOSE 4000

CMD ["npm", "run", "dev"]
