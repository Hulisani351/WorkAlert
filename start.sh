#!/bin/sh

# Start the FastAPI backend in the background
cd /api && python3 main.py &

# Start Nginx in the foreground
nginx -g "daemon off;" 