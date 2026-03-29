#!/bin/bash

# ============================================
# UFUG Kifat Holdings - VPS Deployment Script
# ============================================
# Debian/Ubuntu VPS. Run with sudo so packages can be installed:
#   sudo bash deploy.sh
# Or: chmod +x deploy.sh && sudo ./deploy.sh
#
# This script will:
#   - apt-get update; install git, curl, ca-certificates, build-essential (if apt is available)
#   - Install Node.js 20.x via NodeSource if node is missing
#   - Clone or pull from GitHub, npm ci, npm run build
#
# Optional:
#   UFUG_APT_UPGRADE=1 — also run apt-get upgrade -y (can restart services; use with care)

set -euo pipefail

# Configuration (must match your GitHub repository)
REPO_URL="${REPO_URL:-https://github.com/theunknown2025/ufuq-kifat-holdings.git}"
PROJECT_DIR="${PROJECT_DIR:-/var/www/ufuq-kifat-holdings}"

# Run a command as root (no-op if already root)
as_root() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo -E "$@"
    fi
}

echo "=========================================="
echo "  UFUG Kifat Holdings - Deployment"
echo "=========================================="

# --- System packages (Debian/Ubuntu): always ensure build tooling & git ---
if command -v apt-get &>/dev/null; then
    echo ""
    echo ">>> Updating package lists and installing required system packages..."
    export DEBIAN_FRONTEND=noninteractive
    as_root apt-get update -y
    as_root apt-get install -y git curl ca-certificates build-essential

    if [[ "${UFUG_APT_UPGRADE:-}" == "1" ]]; then
        echo ""
        echo ">>> apt-get upgrade (UFUG_APT_UPGRADE=1)..."
        as_root apt-get upgrade -y
    fi
else
    echo ""
    echo ">>> No apt-get found; skipping automatic OS package install (use your distro's package manager if git/curl are missing)."
fi

if ! command -v git &>/dev/null; then
    echo "ERROR: git is still not installed. Install it and re-run this script."
    exit 1
fi

# --- Node.js: install Node 20 LTS if missing ---
if ! command -v node &>/dev/null; then
    if command -v apt-get &>/dev/null; then
        echo ""
        echo ">>> Node.js not found; installing Node.js 20.x (NodeSource)..."
        export DEBIAN_FRONTEND=noninteractive
        curl -fsSL https://deb.nodesource.com/setup_20.x | as_root bash -
        as_root apt-get install -y nodejs
    else
        echo "ERROR: Node.js is not installed and automatic install needs apt-get (Debian/Ubuntu)."
        echo "Install Node.js 20+ manually, then re-run."
        exit 1
    fi
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# --- Clone or update from GitHub ---
PARENT_DIR="$(dirname "$PROJECT_DIR")"
as_root mkdir -p "$PARENT_DIR"

if [[ -d "$PROJECT_DIR/.git" ]]; then
    echo ""
    echo ">>> Pulling latest from GitHub..."
    cd "$PROJECT_DIR"
    git fetch origin
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
    git reset --hard "origin/main" 2>/dev/null || git reset --hard "origin/master"
elif [[ -d "$PROJECT_DIR" ]]; then
    echo "ERROR: $PROJECT_DIR exists but is not a git clone. Remove it or set PROJECT_DIR to a new path."
    exit 1
else
    echo ""
    echo ">>> Cloning repository..."
    if [[ "$(id -u)" -eq 0 ]]; then
        git clone "$REPO_URL" "$PROJECT_DIR"
    else
        sudo -E git clone "$REPO_URL" "$PROJECT_DIR"
        _u="${SUDO_USER:-$USER}"
        if [[ -n "${_u:-}" ]]; then
            sudo chown -R "${_u}:" "$PROJECT_DIR"
        fi
    fi
    cd "$PROJECT_DIR"
    git checkout main 2>/dev/null || true
fi

cd "$PROJECT_DIR"

# --- Dependencies & build ---
if [[ ! -f package-lock.json ]]; then
    echo "ERROR: package-lock.json is missing. Commit it from your dev machine (npm install) so npm ci can run."
    exit 1
fi

echo ""
echo ">>> Installing dependencies (npm ci)..."
npm ci

echo ""
echo ">>> Building (npm run build)..."
npm run build

echo ""
echo "=========================================="
echo "  Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Build output: $PROJECT_DIR/dist"
echo ""
echo "Nginx example server block:"
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
echo "Then: sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "Optional: set UFUG_APT_UPGRADE=1 to run apt-get upgrade on each deploy."
echo ""
