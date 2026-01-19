#!/bin/bash

# Blog Subscription Setup Script
# This script helps you set up the blog subscription feature

echo "📧 Blog Subscription Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✓ Found project root"
echo ""

# Step 1: Backend setup
echo "📦 Setting up backend..."
if [ ! -d "backend" ]; then
    echo "❌ Backend folder not found"
    exit 1
fi

cd backend

if [ ! -f ".env" ]; then
    echo "ℹ️  Creating .env file from template..."
    cp .env.example .env
    
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your credentials:"
    echo "   - Get Gmail App Password from: https://myaccount.google.com/apppasswords"
    echo "   - Fill in: GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_API_KEY"
    echo ""
    echo "Then run: npm install"
    echo ""
else
    echo "✓ .env already exists"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Backend dependencies already installed"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env and add your Gmail credentials"
echo "2. Run: cd backend && npm run dev"
echo "3. In another terminal: npm start"
echo "4. Visit http://localhost:3000/blog"
echo ""
echo "📚 For more info, see BLOG_SUBSCRIPTION_SETUP.md"
