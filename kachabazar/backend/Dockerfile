FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force
COPY . .

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 5056
CMD ["node", "api/index.js"]
