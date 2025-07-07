
# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ---- Production ----
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --production
COPY --from=builder /app/dist ./dist
COPY .env .env
EXPOSE 3001
CMD ["node", "dist/main"]


WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Étape finale avec seulement les dépendances de production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --production

COPY --from=builder /app/dist ./dist

# Si vous utilisez un fichier .env, copiez-le aussi si nécessaire
COPY .env .env

EXPOSE 3001

CMD ["node", "dist/main"]
