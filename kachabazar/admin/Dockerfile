FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4100
