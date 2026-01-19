#!/bin/bash

# Auto-notify all subscribers about latest blog post
# Usage: ./auto-notify-blog.sh

BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
ADMIN_API_KEY=$(grep ADMIN_API_KEY backend/.env | cut -d '=' -f2 | tr -d ' ')

if [ -z "$ADMIN_API_KEY" ]; then
    echo "❌ Error: ADMIN_API_KEY not found in backend/.env"
    exit 1
fi

echo "📧 Auto-sending latest blog notification to all subscribers..."
echo "With lots of ❤️ love!\n"

curl -X POST "$BACKEND_URL/api/auto-notify-latest-blog?key=$ADMIN_API_KEY" \
  -H "Content-Type: application/json"

echo "\n\n✅ Notification sent!"
echo "All subscribers have been notified about your latest blog post!"
