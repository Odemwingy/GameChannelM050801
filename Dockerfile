# Stage 1: Build frontend
FROM node:20-slim AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY src/ src/
COPY public/ public/
COPY scripts/ scripts/
RUN npm run build

# Stage 2: Build server
FROM node:20-slim AS server-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/tsconfig.json ./
COPY server/src/ src/
RUN npm run build

# Stage 3: Production image
FROM node:20-slim
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy frontend build to Nginx html directory
COPY --from=frontend-build /app/dist/ /usr/share/nginx/html/

# Copy server build and dependencies
COPY --from=server-build /app/server/dist/ ./server/
COPY --from=server-build /app/server/node_modules/ ./server/node_modules/
COPY server/config/ ./server/config/

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY ecosystem.config.cjs ./

# Install PM2
RUN npm install -g pm2

EXPOSE 80

CMD ["pm2-runtime", "ecosystem.config.cjs"]
