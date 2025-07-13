#!/usr/bin/env python3

import requests
import json

def test_api():
    try:
        # Test health endpoint
        response = requests.get('https://workalert.fly.dev/api/health')
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Test root endpoint
        response = requests.get('https://workalert.fly.dev/api/')
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api() 