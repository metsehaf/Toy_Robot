#!/bin/bash
# Setup script for Toy Robot Application

set -e

echo "🤖 Setting up Toy Robot Application..."

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Navigate to project
cd /Users/edombiratu/Documents/learning/toyrobot

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Install backend-specific packages
echo "📦 Installing backend packages..."
npm install @nestjs/typeorm typeorm sqlite3

# Build both apps
echo "🔨 Building applications..."
npx nx build backend
npx nx build frontend

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Backend (API Server):"
echo "  npx nx serve backend"
echo ""
echo "Terminal 2 - Frontend (Web UI):"
echo "  npx nx serve frontend"
echo ""
echo "Then open: http://localhost:4200"
echo ""
echo "📖 See QUICK_START.md for usage instructions"
echo "🧪 See TEST_INSTRUCTIONS.md for test cases"
