#!/bin/bash

# Send email to all blog subscribers
# Usage: ./send-subscriber-email.sh "Post Title" "Post content preview" "https://link-to-post"

ADMIN_API_KEY="${ADMIN_API_KEY:-$(grep ADMIN_API_KEY backend/.env | cut -d '=' -f2)}"
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"

if [ $# -lt 3 ]; then
    echo "Usage: ./send-subscriber-email.sh \"Post Title\" \"Post Content\" \"Post Link\""
    echo ""
    echo "Example:"
    echo "  ./send-subscriber-email.sh \"How to Learn React\" \"Check out my new post about React hooks\" \"https://yourportfolio.com/blog/post-id\""
    exit 1
fi

BLOG_TITLE="$1"
CONTENT="$2"
BLOG_LINK="$3"

echo "📧 Sending email to all subscribers..."
echo "Title: $BLOG_TITLE"
echo "Link: $BLOG_LINK"
echo ""

curl -X POST "$BACKEND_URL/api/notify-subscribers?key=$ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"subject\": \"New Blog Post: $BLOG_TITLE\",
    \"blogTitle\": \"$BLOG_TITLE\",
    \"htmlContent\": \"<p>$CONTENT</p>\",
    \"blogLink\": \"$BLOG_LINK\"
  }"

echo ""
echo "✅ Email sending request completed!"
