# Koala Startpage

A modern, static dashboard ("Bento Box" UI) designed to track Koala projects, services, and system status. Built with pure HTML, CSS, Vanilla JS, and Tailwind CSS via CDN.

## Features

- **Live Clock** with dynamic greeting (DE/EN)
- **GitHub Releases** tracker with localStorage caching (10min TTL)
- **Services & Quick Links** to all Koala projects
- **Tailscale Internal Links** (only accessible within the Tailnet)
- **DE/EN Language Toggle** (persisted in localStorage)
- Glassmorphism dark theme with stagger animations

## Deployment with Caddy

This project requires **no build step**. Serve directly from any web server.

### Example `Caddyfile`

```caddyfile
start.koalastuff.net {
    root * /opt/KoalaStartpage
    file_server

    header {
        -Server
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
}
```

## Updating

```bash
cd /opt/KoalaStartpage
git pull origin main
```
No restart needed — Caddy serves the new files immediately.

## Modifying Tracked Repositories

Edit the `repositories` array in `script.js`:

```javascript
const repositories = [
  { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
  { repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
  { repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaTimer' },
];
```

The `displayName` field controls what's shown in the UI, independent of the actual GitHub repo name.
