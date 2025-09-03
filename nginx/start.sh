#!/bin/bash
echo "Starting nginx..."
cd "$(dirname "$0")"
./nginx
echo "nginx started successfully!"
