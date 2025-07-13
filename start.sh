#!/bin/sh

echo "Starting WorkAlert application..."

# Create API directory if it doesn't exist
mkdir -p /api/uploads

# Start the FastAPI backend in the background
echo "Starting FastAPI server..."
cd /api && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info &

# Wait for the API to start
echo "Waiting for API to start..."
sleep 5

# Check if the API is running
if curl -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ FastAPI server is running"
else
    echo "❌ FastAPI server failed to start"
    # Try to start it again
    cd /api && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info &
    sleep 3
fi

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g "daemon off;" 