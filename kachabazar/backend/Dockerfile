FROM node:22-alpine

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force

COPY . .

EXPOSE 5056

CMD ["npm", "run", "dev"]
