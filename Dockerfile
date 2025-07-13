# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npm run build

# Python API stage
FROM python:3.11-slim AS api

WORKDIR /api

# Install Python dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API code
COPY api/main.py .

# Create uploads directory
RUN mkdir -p uploads

# Final stage for app image
FROM nginx:stable-alpine

# Install Python and required packages
RUN apk add --no-cache python3 py3-pip curl

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html/
COPY --from=build /app/public/50x.html /usr/share/nginx/html/

# Copy Python and API
COPY --from=api /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=api /api/main.py /api/main.py
COPY --from=api /api/uploads /api/uploads

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create required directories with proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD ["/start.sh"]
