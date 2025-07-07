
# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ---- Nginx ----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]


# Installer les dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Construire l'application React
RUN npm run build

# Étape finale : serveur NGINX optimisé
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copier les fichiers statiques du build
COPY --from=builder /app/build .

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
