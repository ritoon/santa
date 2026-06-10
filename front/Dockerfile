# --- Étape 1 : build du front avec pnpm ---
FROM node:22-alpine AS build

# L'URL de l'API est injectée au build car Vite l'inline dans le bundle.
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

RUN corepack enable
WORKDIR /app

# Cache des dépendances : on copie d'abord les manifests.
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# --- Étape 2 : service des fichiers statiques via Nginx ---
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
