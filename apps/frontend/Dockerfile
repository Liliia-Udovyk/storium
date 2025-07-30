# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/frontend/package*.json ./
RUN npm install

COPY apps/frontend ./
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
