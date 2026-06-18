FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps && npm cache clean --force
COPY . .
RUN npm run build

FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build ./build
EXPOSE 4100
CMD ["serve", "-s", "build", "-l", "4100"]
