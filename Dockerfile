# ==============================================================================
# PJSOFONIC SOFOMail Frontend Dockerfile (Production Render Deployment)
# Multi-stage build with Node.js 20 & Nginx Alpine
# ==============================================================================

# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build production bundle
COPY . .
RUN npm run build

# Production Serving Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built Angular distribution assets
COPY --from=build /app/dist/sofomail ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Render dynamic port binding
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
