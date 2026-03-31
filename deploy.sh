#!/bin/bash

# ==============================================================
# UFUG Kifat Holdings - End-to-End VPS Deployment (Debian/Ubuntu)
# ==============================================================
# Purpose:
#   Idempotent full deploy script for a static Vite/React app:
#   system setup -> code sync -> build -> nginx config -> optional SSL
#   -> service reload -> verification checks.
#
# Run:
#   sudo bash deploy.sh
#
# Domain default:
#   DOMAIN defaults to ufuqkifatalmutahida.com
#   Override only if you need another domain.
#
# Recommended env:
#   EMAIL="ops@example.com"        # for Let's Encrypt notices
#
# Optional env:
#   REPO_URL="https://github.com/theunknown2025/ufuq-kifat-holdings.git"  # public repo, no username/password needed
#   BRANCH="main"
#   PROJECT_DIR="/var/www/ufuq-kifat-holdings"
#   NODE_MAJOR="20"
#   APP_USER="www-data"
#   ENABLE_SSL="1"                 # 1=yes, 0=no (default 1)
#   FORCE_HTTPS="1"                # 1=yes, 0=no (default 1, when SSL enabled)
#   ENABLE_UFW="0"                 # 1=yes, 0=no (default 0; safer manual control)
#   UFUG_APT_UPGRADE="0"           # 1=yes, 0=no (default 0)
#   STRICT_CLEAN_DEPLOY="1"        # 1=git reset --hard to origin/BRANCH, 0=safe fast-forward pull

set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/theunknown2025/ufuq-kifat-holdings.git}"
BRANCH="${BRANCH:-main}"
PROJECT_DIR="${PROJECT_DIR:-/var/www/ufuq-kifat-holdings}"
DOMAIN="${DOMAIN:-ufuqkifatalmutahida.com}"
EMAIL="${EMAIL:-}"
NODE_MAJOR="${NODE_MAJOR:-20}"
APP_USER="${APP_USER:-www-data}"
ENABLE_SSL="${ENABLE_SSL:-1}"
FORCE_HTTPS="${FORCE_HTTPS:-1}"
ENABLE_UFW="${ENABLE_UFW:-0}"
UFUG_APT_UPGRADE="${UFUG_APT_UPGRADE:-0}"
STRICT_CLEAN_DEPLOY="${STRICT_CLEAN_DEPLOY:-1}"

PARENT_DIR="$(dirname "$PROJECT_DIR")"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN:-ufuq-kifat-holdings}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN:-ufuq-kifat-holdings}"
DEPLOY_LOG_PREFIX="[UFUG-DEPLOY]"

log() { echo "${DEPLOY_LOG_PREFIX} $*"; }
warn() { echo "${DEPLOY_LOG_PREFIX} WARNING: $*" >&2; }
fail() { echo "${DEPLOY_LOG_PREFIX} ERROR: $*" >&2; exit 1; }

as_root() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo -E "$@"
    fi
}

require_cmd() {
    command -v "$1" &>/dev/null || fail "Required command not found: $1"
}

require_domain_when_needed() {
    if [[ -z "$DOMAIN" ]]; then
        fail "DOMAIN is required. Example: DOMAIN=ufuqkifatalmutahida.com sudo bash deploy.sh"
    fi
}

install_base_packages() {
    require_cmd apt-get
    export DEBIAN_FRONTEND=noninteractive

    log "Updating apt index and installing base packages..."
    as_root apt-get update -y
    as_root apt-get install -y \
        git curl ca-certificates build-essential nginx ufw

    if [[ "$UFUG_APT_UPGRADE" == "1" ]]; then
        log "Running apt-get upgrade (UFUG_APT_UPGRADE=1)..."
        as_root apt-get upgrade -y
    fi
}

install_or_validate_node() {
    if command -v node &>/dev/null; then
        local node_major
        node_major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
        if [[ "$node_major" -lt "$NODE_MAJOR" ]]; then
            fail "Node $(node -v) detected, but Node ${NODE_MAJOR}+ is required."
        fi
        log "Using existing Node $(node -v), npm $(npm -v)"
        return
    fi

    log "Installing Node.js ${NODE_MAJOR}.x via NodeSource..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | as_root bash -
    as_root apt-get install -y nodejs
    log "Installed Node $(node -v), npm $(npm -v)"
}

prepare_project_dir() {
    log "Ensuring project parent directory exists: $PARENT_DIR"
    as_root mkdir -p "$PARENT_DIR"

    if id "$APP_USER" &>/dev/null; then
        as_root chown -R "$APP_USER":"$APP_USER" "$PARENT_DIR" || true
    else
        warn "APP_USER '$APP_USER' not found; skipping ownership alignment."
    fi
}

sync_repository() {
    log "Using public GitHub repository access (no username/password required)."
    if [[ -d "$PROJECT_DIR/.git" ]]; then
        log "Repository exists. Syncing branch '$BRANCH'..."
        cd "$PROJECT_DIR"
        git fetch origin
        git checkout "$BRANCH"
        if [[ "$STRICT_CLEAN_DEPLOY" == "1" ]]; then
            log "Applying strict clean deploy (reset --hard origin/$BRANCH)..."
            git reset --hard "origin/$BRANCH"
        else
            log "Applying safe deploy (fast-forward pull only)..."
            git pull --ff-only origin "$BRANCH"
        fi
    elif [[ -d "$PROJECT_DIR" ]]; then
        fail "$PROJECT_DIR exists but is not a git repository."
    else
        log "Cloning repository branch '$BRANCH'..."
        as_root git clone --branch "$BRANCH" "$REPO_URL" "$PROJECT_DIR"
        if id "$APP_USER" &>/dev/null; then
            as_root chown -R "$APP_USER":"$APP_USER" "$PROJECT_DIR"
        fi
        cd "$PROJECT_DIR"
    fi
}

build_app() {
    cd "$PROJECT_DIR"
    [[ -f package-lock.json ]] || fail "package-lock.json missing; commit lockfile first."

    log "Installing dependencies with npm ci..."
    npm ci
    log "Running production build..."
    npm run build

    [[ -f "$PROJECT_DIR/dist/index.html" ]] || fail "Build output missing: $PROJECT_DIR/dist/index.html"
    log "Build output verified at $PROJECT_DIR/dist"
}

write_nginx_http_site() {
    local conf_file
    conf_file="$(mktemp)"
    cat >"$conf_file" <<EOF
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
    as_root cp "$conf_file" "$NGINX_SITE"
    rm -f "$conf_file"
}

write_nginx_https_redirect_site() {
    local conf_file
    conf_file="$(mktemp)"
    cat >"$conf_file" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://$DOMAIN\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    root $PROJECT_DIR/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

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

    as_root cp "$conf_file" "$NGINX_SITE"
    rm -f "$conf_file"
}

enable_nginx_site() {
    if [[ -f /etc/nginx/sites-enabled/default ]]; then
        as_root rm -f /etc/nginx/sites-enabled/default
    fi
    as_root ln -sf "$NGINX_SITE" "$NGINX_ENABLED"
    as_root nginx -t
    as_root systemctl enable nginx
    as_root systemctl restart nginx
}

setup_ufw_if_requested() {
    if [[ "$ENABLE_UFW" != "1" ]]; then
        log "Skipping UFW changes (ENABLE_UFW=0)."
        return
    fi

    log "Configuring UFW for OpenSSH and Nginx Full..."
    as_root ufw allow OpenSSH
    as_root ufw allow "Nginx Full"
    as_root ufw --force enable
}

ensure_certbot_installed() {
    if command -v certbot &>/dev/null; then
        return
    fi
    log "Installing certbot and nginx plugin..."
    as_root apt-get install -y certbot python3-certbot-nginx
}

setup_ssl_if_requested() {
    if [[ "$ENABLE_SSL" != "1" ]]; then
        log "Skipping SSL setup (ENABLE_SSL=0)."
        return
    fi

    [[ -n "$EMAIL" ]] || fail "EMAIL is required when ENABLE_SSL=1."
    ensure_certbot_installed

    log "Requesting/renewing certificate for $DOMAIN and www.$DOMAIN..."
    as_root certbot certonly --nginx --non-interactive --agree-tos \
        --email "$EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" --redirect

    if [[ "$FORCE_HTTPS" == "1" ]]; then
        log "Applying HTTPS nginx config with forced redirect..."
        write_nginx_https_redirect_site
        as_root nginx -t
        as_root systemctl reload nginx
    fi
}

verify_deployment() {
    log "Running verification checks..."
    require_cmd curl

    as_root systemctl is-active --quiet nginx || fail "Nginx is not active."
    [[ -f "$PROJECT_DIR/dist/index.html" ]] || fail "dist/index.html not found."

    local local_http_code
    local_http_code="$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1/)"
    [[ "$local_http_code" =~ ^(200|301|302)$ ]] || fail "Local HTTP check failed with status: $local_http_code"
    log "Local HTTP check passed: $local_http_code"

    local domain_http_code
    domain_http_code="$(curl -sS -o /dev/null -w "%{http_code}" "http://$DOMAIN/")" || true
    if [[ "$domain_http_code" =~ ^(200|301|302)$ ]]; then
        log "Domain HTTP check passed: $domain_http_code"
    else
        warn "Domain HTTP check returned '$domain_http_code'. DNS may still be propagating."
    fi

    if [[ "$ENABLE_SSL" == "1" ]]; then
        local domain_https_code
        domain_https_code="$(curl -k -sS -o /dev/null -w "%{http_code}" "https://$DOMAIN/")" || true
        if [[ "$domain_https_code" =~ ^(200|301|302)$ ]]; then
            log "Domain HTTPS check passed: $domain_https_code"
        else
            warn "Domain HTTPS check returned '$domain_https_code'. Check cert/DNS/ports."
        fi
    fi
}

print_summary() {
    cat <<EOF

==============================================================
Deployment completed.
==============================================================
Project dir     : $PROJECT_DIR
Domain          : $DOMAIN
Branch          : $BRANCH
Build output    : $PROJECT_DIR/dist
Nginx site file : $NGINX_SITE
SSL enabled     : $ENABLE_SSL
HTTPS redirect  : $FORCE_HTTPS

Useful checks:
  sudo nginx -t
  sudo systemctl status nginx --no-pager
  curl -I http://$DOMAIN
  curl -I https://$DOMAIN
EOF
}

main() {
    require_domain_when_needed
    require_cmd bash
    require_cmd sed

    log "Starting end-to-end deployment..."
    install_base_packages
    install_or_validate_node
    prepare_project_dir
    sync_repository
    build_app
    write_nginx_http_site
    enable_nginx_site
    setup_ufw_if_requested
    setup_ssl_if_requested
    verify_deployment
    print_summary
}

main "$@"
