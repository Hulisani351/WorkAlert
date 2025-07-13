#!/bin/sh

# Start the FastAPI backend in the background
cd /api && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Wait a moment for the API to start
sleep 3

# Start Nginx in the foreground
nginx -g "daemon off;" 