#!/bin/bash

# ============================================
# UFUG Kifat Holdings - VPS Deployment Script
# ============================================
# Place this script in /var/www/ and run: sudo bash deploy.sh
# Or: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on any error

# Configuration
REPO_URL="https://github.com/theunknown2025/UFUG-kifat-holdings.git"
PROJECT_DIR="/var/www/UFUG-kifat-holdings"
SITE_NAME="UFUG-kifat-holdings"

echo "=========================================="
echo "  UFUG Kifat Holdings - Deployment"
echo "=========================================="

# Check for Node.js (required for build)
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Install it with: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Check for Git
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed."
    echo "Install it with: sudo apt-get update && sudo apt-get install -y git"
    exit 1
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Ensure we're in /var/www
cd /var/www

# Clone or pull the repository
if [ -d "$PROJECT_DIR" ]; then
    echo ""
    echo ">>> Updating existing repository..."
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/main
else
    echo ""
    echo ">>> Cloning repository..."
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Install dependencies
echo ""
echo ">>> Installing dependencies..."
npm ci

# Build the project
echo ""
echo ">>> Building the project..."
npm run build

echo ""
echo "=========================================="
echo "  Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Build output is in: $PROJECT_DIR/dist"
echo ""
echo "To serve the site with nginx, add this to your server block:"
echo ""
echo "  server {"
echo "      listen 80;"
echo "      server_name your-domain.com;"
echo "      root $PROJECT_DIR/dist;"
echo "      index index.html;"
echo "      location / {"
echo "          try_files \$uri \$uri/ /index.html;"
echo "      }"
echo "  }"
echo ""
echo "Then run: sudo nginx -t && sudo systemctl reload nginx"
echo ""
