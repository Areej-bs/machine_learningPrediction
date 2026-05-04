# Multi-stage Dockerfile for Employee Attrition Prediction App

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend with Python (using slim instead of alpine for better Python support)
FROM node:18-slim
WORKDIR /app

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip3 install --upgrade pip setuptools wheel

# Copy backend files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Install Python dependencies
COPY backend/ml/requirements.txt ./ml/
RUN pip3 install --no-cache-dir -r ml/requirements.txt

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
