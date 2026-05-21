# 🐨 Koala Startpage

<div align="center">
  <strong>A modern, static dashboard designed for Koala projects, services, and system monitoring.</strong><br>
  Built with pure HTML, CSS, Vanilla JS, and Tailwind CSS.
</div>

---

## ✨ Features

- **Dynamic Bento Box UI:** A sleek, responsive layout utilizing glassmorphism and modern CSS styling.
- **GitHub Release Tracker:** Automatically fetches and displays the latest releases for configured repositories using the GitHub API, complete with `localStorage` caching (2-hour TTL) to respect API rate limits.
- **Live Clock & Greeting:** Dynamic greetings based on the time of day, with full Internationalization (i18n) support (DE/EN).
- **Service Hub:** Quick access to all active Koala projects (KoalaSync, KoalaWeb, etc.) and server management tools.
- **Internal Tailscale Integration:** Direct links to private infrastructure (Dockge, Grafana, Duplicati) logically grouped for Tailnet users.
- **100% Self-Hosted Privacy:** Zero external CDNs are loaded (all fonts and icons are hosted locally), ensuring absolute GDPR/DSGVO compliance.
- **Zero-Build Production:** The compiled, purged CSS is committed directly to Git in the `www/` folder. The production VPS only serves static files from `www/` and requires no Node.js or NPM build steps.

## 🚀 Deployment

Because the project is entirely static, it can be deployed in seconds by **simply copying the contents of the `www/` directory to your web server root**. We recommend using [Caddy](https://caddyserver.com/) for effortless HTTPS, Gzip/Zstandard compression, browser caching, and robust security headers.

### Production Caddy Server Configuration

For a production deployment, we recommend using Caddy for effortless HTTPS, dynamic compression, strict browser caching, and industry-leading same-origin security.

A complete, ultra-secure production-ready `Caddyfile` template containing Hannover's exact coordinates and the privacy-first weather API reverse proxy is available in the dedicated [CADDYFILE.md](file:///Users/koala/Documents/KoalaStartpage/CADDYFILE.md) documentation.

## 🛠️ Development, Build Pipeline & Icons

To maintain maximum performance (100/100 PageSpeed scores) and support highly secure Content Security Policies (CSP) without requiring `'unsafe-inline'` or `'unsafe-eval'`, this project uses static Tailwind CSS compilation.

The source files consist of:
- `style.src.css` — Contains Tailwind base directives, all custom CSS styles, and an auto-managed Phosphor icon block
- `script.src.js` — Source JS with comments (minified to `www/script.js` on build)
- `www/index.html` / `www/impressum.html` / `www/datenschutz.html` — Scanned by Tailwind to identify utilized classes

The final output is compiled into `www/style.css` (minified and purged), which is tracked in Git to preserve a **zero-build deployment** on the VPS.

### 🎨 Phosphor Icon System

The project uses a **self-hosted Phosphor icon font** (`www/fonts/Phosphor.woff2`) with automatic icon extraction — no external CDN, fully GDPR-compliant.

**To use a new icon:**
1. Add `class="ph ph-your-icon"` anywhere in the HTML or JS source
2. Run `npm run build`
3. Done — the build system finds it automatically and includes it

The full Phosphor icon library (1530 icons) lives at `js/phosphor-full.css` as a **build-time-only** source file. The `js/compile-icons.js` script scans source files, extracts only the used icons, and injects them into `style.src.css` before Tailwind compiles it. See [`js/PHOSPHOR_ICONS.md`](js/PHOSPHOR_ICONS.md) for full details.

> [!IMPORTANT]
> **Do NOT delete `js/phosphor-full.css`** — it is the icon lookup source for the build pipeline. Without it, adding any new icon requires manually looking up Unicode codepoints.

### Build Pipeline

`npm run build` runs four steps in sequence:
1. `compile-icons.js` — auto-extracts used `ph-*` icon rules into `style.src.css`
2. `tailwindcss` — compiles & purges `style.src.css` → `www/style.css`
3. `compile-js.js` — minifies `script.src.js` → `www/script.js`
4. `version-sw.js` — bumps the Service Worker cache version

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
   *This automatically recompiles and purges `style.css` in real-time as you edit HTML or JS files. Note: watch mode only runs Tailwind, not the full pipeline. Run `npm run build` for a complete build.*

> [!IMPORTANT]
> **Local Testing & Browser Security:**
> Modern browser security policies block direct file access (`file:///` protocol) for loading local fonts, icons, or modules. When testing or running browser subagents, **do not open the HTML files directly.** 
>
> You **must** serve the project using a local web server, for example:
> ```bash
> npx http-server -p 8080
> ```
> Then navigate to `http://localhost:8080` in your browser.

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
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb' },
];
```

*Note: The `displayName` parameter controls the frontend label, allowing you to use friendly names regardless of the actual GitHub repository slug.*

## 🔒 Privacy & Legal

The startpage includes built-in `Impressum` and `Datenschutz` (Privacy Policy) pages. These are tailored for a private hobby project. Email addresses are obfuscated using inline JavaScript to prevent automated bot scraping.
