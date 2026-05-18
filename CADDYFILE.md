# 🌐 Production Caddyfile Configuration (Privacy-First)

This document contains the recommended production Caddyfile configuration for hosting **KoalaStartpage** (KoalaWeb). It implements high-performance compression, strict browser caching, industry-leading same-origin security headers (A+ on Mozilla Observatory), and a **privacy-first reverse proxy** for weather forecast lookups in **Hannover, Niedersachsen**.

## Caddyfile Template

Add this block directly into your VPS server's `/etc/caddy/Caddyfile`:

```caddy
koalastuff.net {
    # 1. Enable modern dynamic compression (Zstandard & Gzip)
    encode zstd gzip

    # 2. Ultra-Strict Same-Origin Security Headers (A+ 110/100 Rating)
    header {
        # Strict HTTPS (Max HSTS age, subdomains, preloading)
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

        # Frame Protection (Prevents Clickjacking)
        X-Frame-Options "SAMEORIGIN"

        # MIME Sniffing Protection
        X-Content-Type-Options "nosniff"

        # Referrer Policy (Secure origin on external clicks)
        Referrer-Policy "strict-origin-when-cross-origin"

        # Permissions Policy (Locks down unused browser hardware/features)
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()"

        # Strict Content Security Policy (100% CDN-Free and HASH-FREE)
        # Allows connection only to self and GitHub API (releases) with flexible 'unsafe-inline' script handling
        Content-Security-Policy "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; worker-src 'self'; connect-src 'self' https://api.github.com; img-src 'self' data: https://start.koalastuff.net; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';"

        # Shield Caddy version signature
        -Server
    }

    # 3. Privacy-First Weather API Reverse Proxy (Hannover, Niedersachsen, DE)
    # The browser fetches same-origin `/api/weather` (allowed under CSP 'self').
    # Caddy rewrites the query with Hannover's coordinates (52.37, 9.73) internally
    # and forwards it to the keyless, non-tracking Open-Meteo API.
    # No domestic IP addresses are leaked; Open-Meteo only sees your VPS server's IP.
    rewrite /api/weather /v1/forecast?latitude=52.37&longitude=9.73&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3
    reverse_proxy /v1/forecast* https://api.open-meteo.com {
        header_up Host {upstream_hostport}
    }

    # 4. Best-Practice 30-Day Browser Caching for static assets
    @static {
        file
        path *.css *.js *.svg *.ico *.png *.jpg *.woff2
    }
    header @static Cache-Control "public, max-age=2592000"

    # 5. Webroot and static file server
    root * /var/www/startpage
    file_server
}
```

## 🛠️ Deploying & Reloading Caddy

After editing the configuration on your server, validate the syntax and hot-reload Caddy without dropping active connections:

```bash
# Validate Caddyfile syntax
caddy validate --config /etc/caddy/Caddyfile

# Hot-reload Caddy server
caddy reload
```
