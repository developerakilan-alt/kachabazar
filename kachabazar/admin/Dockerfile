FROM node:22-alpine

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps && npm cache clean --force

COPY . .

EXPOSE 4100

CMD ["npx", "vite", "--force", "--port", "4100", "--host", "0.0.0.0"]
