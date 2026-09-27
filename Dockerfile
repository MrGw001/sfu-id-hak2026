# -------------------------------------------------------------
# Stage 1: Build Frontend
# -------------------------------------------------------------
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies with lockfile (fast and reliable)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund || npm install --legacy-peer-deps --no-audit --no-fund

# Copy application sources
COPY . .

# Build application
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production Nginx Server
# -------------------------------------------------------------
FROM nginx:alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP ports (3000 for standard dev/preview, 80 for production)
EXPOSE 80 3000

CMD ["nginx", "-g", "daemon off;"]
