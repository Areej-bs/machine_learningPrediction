# Backend Dockerfile with Python support
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY ml/requirements.txt ./ml/
RUN pip install --no-cache-dir -r ml/requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p models data

EXPOSE 5000

CMD ["node", "server.js"]
