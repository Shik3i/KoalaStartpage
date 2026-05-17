# 🐨 Koala Startpage

<div align="center">
  <strong>A modern, static dashboard designed for Koala projects, services, and system monitoring.</strong><br>
  Built with pure HTML, CSS, Vanilla JS, and Tailwind CSS.
</div>

---

## ✨ Features

- **Dynamic Bento Box UI:** A sleek, responsive layout utilizing glassmorphism and modern CSS styling.
- **GitHub Release Tracker:** Automatically fetches and displays the latest releases for configured repositories using the GitHub API, complete with `localStorage` caching (10-minute TTL) to respect API rate limits.
- **Live Clock & Greeting:** Dynamic greetings based on the time of day, with full Internationalization (i18n) support (DE/EN).
- **Service Hub:** Quick access to all active Koala projects (KoalaSync, KoalaTimer, etc.) and server management tools.
- **Internal Tailscale Integration:** Direct links to private infrastructure (Dockge, Grafana, Duplicati) logically grouped for Tailnet users.
- **Zero Build Step:** Entirely static. No Webpack, Node.js, or NPM required. Serve directly via any lightweight web server.

## 🚀 Deployment

Because the project is entirely static, it can be deployed in seconds. We recommend using [Caddy](https://caddyserver.com/) for effortless HTTPS and static file serving.

### Example `Caddyfile`

```caddyfile
koalastuff.net {
        import security_headers
        root * /var/www/startpage
        file_server
}
```

## 🛠️ Development & Tailwind Compilation

To maintain maximum performance (100/100 PageSpeed scores) and support highly secure Content Security Policies (CSP) without requiring `'unsafe-inline'` or `'unsafe-eval'`, this project uses static Tailwind CSS compilation.

The source files consist of:
- `style.src.css` — Contains Tailwind base directives and all custom CSS styles.
- `index.html` / `impressum.html` / `datenschutz.html` — Scanned by Tailwind to identify utilized classes.

The final output is compiled into `style.css` (minified and purged), which is tracked in Git to preserve a **zero-build deployment** on the VPS.

### Local Development Setup

If you are developing on a new machine or running a new coding agent, follow these steps:

1. **Install Node.js & npm** (if not already installed).
2. **Install dependencies** (strictly for local development):
   ```bash
   npm install
   ```
3. **Compile once:**
   ```bash
   npm run build
   ```
4. **Run hot reload (watch mode) during active development:**
   ```bash
   npm run watch
   ```
   *This automatically recompiles and purges `style.css` in real-time as you edit HTML or JS files.*

> [!NOTE]
> The `node_modules` folder is excluded from Git via `.gitignore`. The production web server (e.g. Caddy) only serves the optimized static assets. You do **not** need to install npm packages on your production VPS.

## 🔄 Updating

To deploy the latest changes, simply pull from the repository:

```bash
cd /var/www/startpage
git pull origin main
```
No build commands or server restarts are required.

## ⚙️ Configuration

### Tracked Repositories

To modify the GitHub repositories tracked in the "Latest Releases" widget, edit the `repositories` array in `script.js`:

```javascript
const repositories = [
  { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
  { repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
  { repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaTimer' },
];
```

*Note: The `displayName` parameter controls the frontend label, allowing you to use friendly names regardless of the actual GitHub repository slug.*

## 🔒 Privacy & Legal

The startpage includes built-in `Impressum` and `Datenschutz` (Privacy Policy) pages. These are tailored for a private hobby project. Email addresses are obfuscated using inline JavaScript to prevent automated bot scraping.
