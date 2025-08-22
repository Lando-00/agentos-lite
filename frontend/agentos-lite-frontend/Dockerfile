FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite must listen on all interfaces when inside a container
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]