# 🌐 Production Caddyfile Configuration

This document contains the recommended production Caddyfile configuration for hosting **KoalaStartpage**. It implements high-performance compression, strict browser caching, industry-leading same-origin security headers (A+ on Mozilla Observatory), and a **privacy-first reverse proxy** for weather forecast lookups in **Hannover, Niedersachsen**.

## Caddyfile Template

Add this block into your VPS server's `/etc/caddy/Caddyfile`:

```caddy
koalastuff.net {
    # ─── 1. Dynamic Compression ───
    encode zstd gzip

    # ─── 2. Security Headers (A+ Rating) ───
    header {
        # Strict HTTPS (Max HSTS age, subdomains, preloading)
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

        # Frame Protection (Prevents Clickjacking)
        X-Frame-Options "SAMEORIGIN"

        # MIME Sniffing Protection
        X-Content-Type-Options "nosniff"

        # Referrer Policy (Secure origin on external clicks)
        Referrer-Policy "strict-origin-when-cross-origin"

        # Permissions Policy (Locks down unused browser features)
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()"

        # Strict Content Security Policy (100% CDN-Free, HASH-FREE)
        # Allows connection only to self and GitHub API with strict script-src 'self'
        Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; worker-src 'self'; connect-src 'self' https://api.github.com; img-src 'self' data: https://start.koalastuff.net; manifest-src 'self'; base-uri 'none'; form-action 'self' https://www.google.com https://duckduckgo.com https://www.youtube.com; frame-ancestors 'none';"

        # Hide server signature
        -Server
    }

    # ─── 3. Privacy-First Weather API Reverse Proxy ───
    # Browser fetches same-origin /api/weather (allowed under CSP 'self').
    # Caddy rewrites the query with Hannover's coordinates (52.37, 9.73) internally
    # and forwards it to the keyless, non-tracking Open-Meteo API.
    # No domestic IP addresses are leaked — Open-Meteo only sees the VPS IP.
    rewrite /api/weather /v1/forecast?latitude=52.37&longitude=9.73&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3
    reverse_proxy /v1/forecast* https://api.open-meteo.com {
        header_up Host {upstream_hostport}
    }

    # ─── 4. Browser Caching Strategy ───

    # Immutable caching for local fonts (they never change) — 1 year
    @fonts {
        file
        path *.woff2
    }
    header @fonts Cache-Control "public, max-age=31536000, immutable"

    # 30-Day cache for other long-lived assets (excluding Service Worker)
    @static {
        file
        path *.css *.js *.svg *.ico *.png *.jpg
        not path /sw.js
    }
    header @static Cache-Control "public, max-age=2592000"

    # Service Worker MUST never be cached in HTTP cache for rapid PWA updates
    @sw file /sw.js
    header @sw Cache-Control "no-cache, no-store, must-revalidate"

    # ─── 5. Static File Server ───
    # Set to /var/www/startpage/www if checking out the Git repo directly,
    # or /var/www/startpage if only copying the www/ directory contents.
    root * /var/www/startpage/www
    file_server
}
```

## Deploying & Reloading Caddy

After editing the configuration on your server, validate the syntax and hot-reload Caddy without dropping active connections:

```bash
# Validate Caddyfile syntax
caddy validate --config /etc/caddy/Caddyfile

# Hot-reload Caddy server (zero downtime)
caddy reload
```

## Caching Strategy Overview

| Asset Type | Cache Duration | Strategy |
|-----------|---------------|----------|
| Fonts (`.woff2`) | 1 year | Immutable — fonts are versioned by filename |
| CSS, JS, SVG, images | 30 days | Long-lived — cache-busted via SW updates |
| Service Worker (`sw.js`) | No cache | Must always fetch latest for PWA updates |

## Security Headers Explained

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforces HTTPS for 2 years across all subdomains |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking by blocking iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information on external navigation |
| `Permissions-Policy` | Multiple disabled features | Locks down camera, microphone, geolocation, etc. |
| `Content-Security-Policy` | Strict allowlist | Blocks all inline scripts, external CDNs, and unauthorized connections |
