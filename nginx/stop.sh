#!/bin/bash
echo "Stopping nginx..."
cd "$(dirname "$0")"
./nginx -s stop
echo "nginx stopped successfully!"
