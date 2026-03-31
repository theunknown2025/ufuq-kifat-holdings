#!/usr/bin/env bash

set -euo pipefail

# Quick repair script for common VPS 404 issues:
# - ensures build output exists
# - rewrites nginx site with correct root + SPA fallback
# - enables the domain site and disables default
# - validates and restarts nginx

DOMAIN="${DOMAIN:-ufuqkifatalmutahida.com}"
PROJECT_DIR="${PROJECT_DIR:-/var/www/ufuq-kifat-holdings}"
SITE_NAME="${SITE_NAME:-$DOMAIN}"
SITE_FILE="/etc/nginx/sites-available/${SITE_NAME}"
SITE_LINK="/etc/nginx/sites-enabled/${SITE_NAME}"
BUILD_BEFORE_FIX="${BUILD_BEFORE_FIX:-1}"
NODE_MAJOR="${NODE_MAJOR:-20}"

log() { echo "[UFUG-FIX] $*"; }
warn() { echo "[UFUG-FIX] WARNING: $*" >&2; }
fail() { echo "[UFUG-FIX] ERROR: $*" >&2; exit 1; }

as_root() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo -E "$@"
    fi
}

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

ensure_node_if_building() {
    if [[ "$BUILD_BEFORE_FIX" != "1" ]]; then
        return
    fi

    if command -v node >/dev/null 2>&1; then
        local major
        major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
        if [[ "$major" -ge "$NODE_MAJOR" ]]; then
            return
        fi
        fail "Detected Node $(node -v). Node ${NODE_MAJOR}+ required to build."
    fi

    log "Installing Node.js ${NODE_MAJOR}.x..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | as_root bash -
    as_root apt-get install -y nodejs
}

build_if_requested() {
    if [[ "$BUILD_BEFORE_FIX" != "1" ]]; then
        log "Skipping build step (BUILD_BEFORE_FIX=0)."
        return
    fi

    [[ -d "$PROJECT_DIR" ]] || fail "Project directory not found: $PROJECT_DIR"
    [[ -f "$PROJECT_DIR/package-lock.json" ]] || fail "package-lock.json not found in $PROJECT_DIR"

    log "Building app at $PROJECT_DIR..."
    cd "$PROJECT_DIR"
    npm ci
    npm run build
}

ensure_dist_exists() {
    [[ -f "$PROJECT_DIR/dist/index.html" ]] || fail "Missing build output: $PROJECT_DIR/dist/index.html"
}

write_nginx_site() {
    local tmp_conf
    tmp_conf="$(mktemp)"

    cat >"$tmp_conf" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $PROJECT_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(?:css|js|mjs|map|ico|png|jpg|jpeg|gif|svg|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files \$uri =404;
    }
}
EOF

    as_root mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
    as_root cp "$tmp_conf" "$SITE_FILE"
    rm -f "$tmp_conf"
}

activate_nginx_site() {
    if [[ -f /etc/nginx/sites-enabled/default ]]; then
        log "Removing default nginx site symlink..."
        as_root rm -f /etc/nginx/sites-enabled/default
    fi

    log "Enabling site: $SITE_FILE"
    as_root ln -sf "$SITE_FILE" "$SITE_LINK"
}

reload_nginx() {
    log "Validating nginx config..."
    as_root nginx -t
    log "Restarting nginx..."
    as_root systemctl enable nginx
    as_root systemctl restart nginx
}

verify() {
    require_cmd curl
    local local_code domain_code

    local_code="$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1/)"
    domain_code="$(curl -sS -o /dev/null -w "%{http_code}" "http://$DOMAIN/" || true)"

    log "127.0.0.1 HTTP status: $local_code"
    log "$DOMAIN HTTP status: $domain_code"

    if [[ ! "$local_code" =~ ^(200|301|302)$ ]]; then
        warn "Local check is not healthy."
    fi
    if [[ ! "$domain_code" =~ ^(200|301|302)$ ]]; then
        warn "Domain check is not healthy. DNS may still be propagating."
    fi
}

main() {
    require_cmd sed
    require_cmd nginx
    require_cmd npm
    require_cmd git

    ensure_node_if_building
    build_if_requested
    ensure_dist_exists
    write_nginx_site
    activate_nginx_site
    reload_nginx
    verify

    cat <<EOF

Done. Applied 404 fix workflow.

Run these checks:
  sudo nginx -t
  sudo systemctl status nginx --no-pager
  curl -I http://$DOMAIN

If DNS is ready and SSL is configured:
  curl -I https://$DOMAIN
EOF
}

main "$@"
