FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend ./backend

# The PORT is set by Railway
ENV PORT=8000

# Using shell form for CMD to allow environment variable expansion
CMD python3 -m uvicorn main:app --app-dir backend --host 0.0.0.0 --port ${PORT}
