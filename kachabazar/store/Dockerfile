FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force
COPY . .
COPY .env.docker .env.local
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.docker ./.env.local
EXPOSE 3000
CMD ["npx", "next", "start"]
