# Koala Startpage

A modern, static dashboard ("Bento Box" UI) designed to track Koala projects, services, and system status. Built with pure HTML, CSS, Vanilla JS, and Tailwind CSS via CDN.

## Deployment with Caddy

This project requires **no build step**. It can be served directly from any web server. Here is an example of how to serve it using Caddy.

### Example `Caddyfile`

```caddyfile
start.koalastuff.net {
    root * /path/to/KoalaStartpage
    file_server
    
    # Optional security headers
    header {
        -Server
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
}
```

## Updating

To pull the latest changes, simply navigate to the repository on your server and pull:

```bash
cd /path/to/KoalaStartpage
git pull origin main
```
There is no need to restart the web server or rebuild any assets.

## Modifying Tracked Repositories

To add or remove GitHub repositories from the release tracker, open `script.js` and edit the `repositories` array:

```javascript
const repositories = [
    'Shik3i/KoalaSync',
    'Shik3i/KoalaClicker',
    'Shik3i/KoalaFlyff',
    'Shik3i/KoalaTimer',
    // 'New/Repo'
];
```
