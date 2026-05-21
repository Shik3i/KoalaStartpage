# 🐨 Koala Startpage

<div align="center">
  <strong>A modern, static dashboard designed for Koala projects, services, and system monitoring.</strong><br>
  Built with pure HTML, CSS, Vanilla JS, and Tailwind CSS.
</div>

---

## ✨ Features

- **Dynamic Bento Box UI** — Sleek, responsive glassmorphic layout with GPU-accelerated spotlight hover effects and custom micro-animations.
- **GitHub Release & Package Tracker** — Automatically fetches and displays the latest releases or Docker package tags for configured repositories via the GitHub API, with a 2-hour `localStorage` cache to respect API rate limits.
- **Live Clock & Greeting** — Dynamic time-based greetings with a ticking clock (including seconds) and full bilingual i18n support (DE/EN).
- **Service Hub** — Quick access to all active Koala projects (KoalaSync, KoalaWeb, KoalaSnippets, etc.) and server management tools.
- **Internal Tailscale Integration** — Direct links to private infrastructure (Dockge, Grafana, Duplicati, Unraid) logically grouped for Tailnet users.
- **100% Self-Hosted Privacy** — Zero external CDNs. All fonts and icons are hosted locally, ensuring full GDPR/DSGVO compliance.
- **Zero-Build Production** — Compiled, purged CSS and minified JS are committed directly to Git. The production VPS serves static files from `www/` with no Node.js or NPM build steps required.
- **PWA Support** — Service worker with network-first caching strategy for offline resilience and instant updates.

## 🚀 Deployment

Because the project is entirely static, it can be deployed in seconds by **copying the contents of the `www/` directory to your web server root**. We recommend using [Caddy](https://caddyserver.com/) for effortless HTTPS, Gzip/Zstandard compression, browser caching, and robust security headers.

A complete, production-ready `Caddyfile` template is available in the dedicated [CADDYFILE.md](CADDYFILE.md) documentation.

## 🛠️ Development & Build Pipeline

To maintain maximum performance (100/100 PageSpeed scores) and support strict Content Security Policies (CSP) without `'unsafe-inline'` or `'unsafe-eval'`, this project uses static Tailwind CSS compilation and JS minification.

### Source vs. Compiled Files

| Type | File | Description |
|------|------|-------------|
| **Source** | `script.src.js` | Editable JavaScript source with comments |
| **Source** | `style.src.css` | Editable CSS source with Tailwind directives |
| **Compiled** | `www/script.js` | Minified output — **do not edit** |
| **Compiled** | `www/style.css` | Purged and minified output — **do not edit** |

> [!IMPORTANT]
> Always edit the source files in the repository root. The `www/` directory contains compiled outputs that are regenerated on every build.

### Build Pipeline

`npm run build` runs four steps in sequence:

1. **`compile-icons.js`** — Auto-extracts used `ph-*` Phosphor icon rules into `style.src.css`
2. **`tailwindcss`** — Compiles and purges `style.src.css` → `www/style.css`
3. **`compile-js.js`** — Strips comments and minifies `script.src.js` → `www/script.js`
4. **`version-sw.js`** — Bumps the Service Worker cache version

### Local Development Setup

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
   > Watch mode runs Tailwind only, not the full pipeline. Run `npm run build` for a complete build after JS or icon changes.

> [!IMPORTANT]
> **Local Testing:** Modern browser security policies block direct file access (`file:///` protocol). Serve the project using a local web server:
> ```bash
> npx http-server -p 8080
> ```
> Then navigate to `http://localhost:8080`.

> [!NOTE]
> The `node_modules` folder is excluded from Git via `.gitignore`. The production web server only serves the optimized static assets — no npm install required on the VPS.

### 🎨 Phosphor Icon System

The project uses a **self-hosted Phosphor icon font** (`www/fonts/Phosphor.woff2`) with automatic icon extraction — no external CDN, fully GDPR-compliant.

**To use a new icon:**
1. Add `class="ph ph-your-icon"` anywhere in the HTML or JS source.
2. Run `npm run build`.
3. Done — the build system finds it automatically and includes it.

The full Phosphor icon library (1530 icons) lives at `js/phosphor-full.css` as a **build-time-only** source file. The `js/compile-icons.js` script scans source files, extracts only the used icons, and injects them into `style.src.css` before Tailwind compiles it. See [`js/PHOSPHOR_ICONS.md`](js/PHOSPHOR_ICONS.md) for full details.

> [!IMPORTANT]
> **Do NOT delete `js/phosphor-full.css`** — it is the icon lookup source for the build pipeline.

## 🔄 Updating

To deploy the latest changes, simply pull from the repository:

```bash
cd /var/www/startpage
git pull origin main
```

No build commands or server restarts are required.

## ⚙️ Configuration

### Tracked Repositories

To modify the GitHub repositories tracked in the "Latest Releases" widget, edit the `repositories` array in `script.src.js`:

```javascript
const repositories = [
  { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
  { repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
  { repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' },
  { repo: 'Shik3i/KoalaSnippets',       displayName: 'KoalaSnippets', type: 'package' },
  { repo: 'Shik3i/KoalaStartpage',      displayName: 'KoalaStartpage' },
];
```

After editing, run `npm run build` to compile the changes.

#### Release vs. Package Tracking

The tracker supports two modes, controlled by the optional `type` field:

| Mode | API Endpoint | Link Target | Use Case |
|------|-------------|-------------|----------|
| **Release** (default) | `/repos/{owner}/{repo}/releases/latest` | `/releases` | Projects that publish GitHub Releases with release notes and assets |
| **Package** (`type: 'package'`) | `/repos/{owner}/{repo}/tags` | `/pkgs/container/{name}` | Projects that publish Docker container images via GitHub Packages — versions are tracked through Git tags rather than formal releases |

When `type: 'package'` is set, the tracker fetches the latest Git tag and links to the GitHub Packages page instead of the Releases page.

> The `displayName` parameter controls the frontend label, allowing friendly names regardless of the actual GitHub repository slug.

### Cache Invalidation

The release tracker caches API responses in `localStorage` under `koala-releases-cache-v3` with a 2-hour TTL. If you change a repository's `type` (e.g., from release to package), bump the `CACHE_KEY` version in `script.src.js` to invalidate stale cached data.

## 🔒 Privacy & Legal

The startpage includes built-in `Impressum` and `Datenschutz` (Privacy Policy) pages, tailored for a private hobby project. Email addresses are obfuscated using JavaScript click handlers to prevent automated bot scraping.
