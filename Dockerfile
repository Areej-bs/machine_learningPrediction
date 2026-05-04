# Multi-stage Dockerfile for Employee Attrition Prediction App

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend with Python - Use Python base image with Node
FROM python:3.11-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first
COPY backend/ml/requirements.txt ./ml/
RUN pip install --no-cache-dir -r ml/requirements.txt

# Copy backend files and install Node dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend/ ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./public

# Create necessary directories
RUN mkdir -p models data

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
