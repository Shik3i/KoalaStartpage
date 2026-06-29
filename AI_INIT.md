# <img src="www/assets/logo-64x64.png" alt="Koala" width="24" height="24" style="vertical-align: middle; margin-right: 0.25em;"> Koala Startpage — AI Initialization & Context Guide

**MANDATORY FIRST READ.** This document outlines the architecture, layout rules, build constraints, and development guidelines for the **Koala Startpage** dashboard. Future AI agents must strictly adhere to these instructions to maintain the site's performance, zero-dependency privacy compliance, and build integrity.

> [!IMPORTANT]
> **SOURCE vs COMPILED FILES — CRITICAL:**
> - **EDIT** `script.src.js` (root) — JavaScript source file with comments.
> - **EDIT** `style.src.css` (root) — CSS source file with Tailwind directives.
> - **NEVER EDIT** `www/script.js` or `www/style.css` — compiled outputs, overwritten on every build.
> - After any change to source files, **ALWAYS run `npm run build`** to compile into `www/`.

---

## 🏗️ Project Overview

**Koala Startpage** is a modern, static, high-performance bento-box dashboard serving as the central landing hub for Koala projects (KoalaSync, KoalaWeb, KoalaClicker, KoalaSnippets), service uptimes, internal Tailnet (Tailscale) home server interfaces, and system monitoring tools.

### Key Features

1. **Dynamic Bento Box UI** — Glassmorphic card layout with responsive Tailwind CSS, GPU-accelerated spotlight coordinate transitions (`--x`, `--y`), and custom micro-animations.
2. **GitHub Release & Package Tracker** — Asynchronously fetches latest releases or Docker package tags via the GitHub REST API. Features a 2-hour `localStorage` cache to respect API rate limits.
3. **Live Clock & Greeting** — Dynamic time-based greetings with a ticking clock (including seconds) and bilingual i18n (DE/EN).
4. **100% Self-Hosted GDPR/DSGVO Privacy** — Zero external CDNs. All assets (Inter fonts, Phosphor icons) are served locally.
5. **Zero-Build Production** — Compiled, purged CSS and minified JS are committed directly to Git. The production VPS serves static files via Caddy with no Node.js or NPM build steps.
6. **Bilingual i18n Support** — Full German (DE) and English (EN) toggle with `localStorage` persistence. Includes a keyboard-accessible WAI-ARIA theme selection dropdown.
7. **PWA Support** — Service worker with network-first caching strategy for offline resilience.

---

## 🛠️ Tech Stack & Build Pipeline

- **Core**: HTML5, Vanilla ES6 JavaScript (zero external framework overhead).
- **Styling**: Tailwind CSS v3 with custom HSL gradient overlays and glassmorphism.
- **Build Pipeline**:
  - **Source CSS**: `style.src.css` — Tailwind directives, `@font-face` definitions, custom components, and auto-managed Phosphor icon block.
  - **Source JS**: `script.src.js` — All application logic (i18n, clock, GitHub tracker, weather, search, tooltips, theme switcher).
  - **Scanned Files**: `www/index.html`, `www/impressum.html`, `www/datenschutz.html`, `script.src.js`.
  - **Compiled CSS**: `www/style.css` — Purged and minified for production.
  - **Compiled JS**: `www/script.js` — Minified output (comments stripped).
- **Service Worker**: `www/sw.js` — Network-first with cache fallback for PWA support.

---

## 🤖 AI Development Directives & Rules

### 1. 🔒 Git Branch Hygiene

Before executing edits or terminal commands, **always run `git status` and `git branch`**. Ensure you are on the `main` branch (unless instructed otherwise) and pull latest commits.

### 2. ⚡ Build Protocol

The `npm run build` command runs **four steps in sequence**:

| Step | Script | Purpose |
|------|--------|---------|
| 1 | `compile-icons.js` | Scans source files for `ph-*` classes, writes icon CSS into `style.src.css` |
| 2 | `tailwindcss` | Compiles and purges `style.src.css` → `www/style.css` |
| 3 | `compile-js.js` | Strips comments and minifies `script.src.js` → `www/script.js` |
| 4 | `version-sw.js` | Bumps the Service Worker cache version |

Run it whenever you touch HTML, JS, or CSS source files:

```bash
npm run build
```

> **Tailwind class purging:** Only classes that appear in scanned files are kept in `www/style.css`. Failure to rebuild will cause missing styles in production.

During active development, use watch mode (Tailwind only, not the full pipeline):

```bash
npm run watch
```

### 3. 🌐 Local Testing & Browser Security

- **DO NOT open `file:///` URLs.** Browser security policies block local file access for fonts, icons, and modules.
- **MUST use a local web server:**
  ```bash
  npx http-server -p 8080
  ```
  Then navigate to `http://localhost:8080`.
- **Always terminate the web server** after visual checks to avoid orphaned processes.

### 4. 🛡️ Strict GDPR & Content Security Policy (CSP)

- **NO external script/style CDNs** — all fonts (`fonts/inter-*.woff2`) and icons (`fonts/Phosphor.woff2`) are served locally.
- **NO INLINE SCRIPTS** — Do not inline JavaScript files into HTML `<script>` tags. The production CSP (`script-src 'self'`) blocks all inline scripts. All JavaScript must remain in external `.js` files.
- **Connect-src** is locked strictly to `'self'` and `https://api.github.com`.

### 5. 🌐 Multilingual i18n Strategy

The project uses a dual approach for localization:

1. **Dynamic Dashboard Translations** (`index.html` / `script.src.js`):
   - Elements in `index.html` use `data-i18n="translation_key"`.
   - Translations are defined in the `translations` object inside `script.src.js`.
   - `applyLanguage()` queries all elements and substitutes text on language change.

2. **Static Document Translations** (`impressum.html` / `datenschutz.html`):
   - Dual markup: `<span lang="de">...</span>` and `<span lang="en">...</span>`.
   - CSS handles visibility based on the active class on `<html>`:
     ```css
     .lang-de [lang="en"] { display: none !important; }
     .lang-en [lang="de"] { display: none !important; }
     ```
   - Language toggles trigger `setLegalLang(lang)` in `js/legal.js`.

### 6. 🔒 Spam Protection & Email Obfuscation

**Never write plain email addresses in raw HTML.** Use the `.email-trigger` class with `data-user` and `data-domain` attributes:

```html
<span class="email-trigger" data-user="admin" data-domain="koalastuff.net">[Show Email]</span>
```

`js/legal.js` reconstructs the address on user click.

### 7. 🏷️ GitHub Tagging & Versioning

- **NEVER automatically create, tag, or push release versions to GitHub.**
- Creating tags or versioned releases must **ONLY occur on explicit user request**.

### 8. ⚡ Performance Patterns

These rules preserve the LCP score and prevent forced layout reflows:

- **LCP Hero Tile — Never hide with `opacity: 0`**: The `.bento-tile--hero` (clock/greeting tile) uses a special `fadeInHero` animation starting at `opacity: 1`. Do NOT apply the generic `.fade-in` class to this tile. The override is defined in `style.src.css` as `.bento-tile--hero.fade-in { opacity: 1; }`.

- **No `void element.offsetWidth` (Forced Reflow forbidden)**: Never use forced-reflow patterns to trigger CSS transitions. Always use `requestAnimationFrame()`:
  ```javascript
  // ✅ Correct — no forced reflow
  el.classList.remove('hidden');
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
  });

  // ❌ Wrong — forces synchronous layout recalculation
  el.classList.remove('hidden');
  void el.offsetWidth; // FORBIDDEN
  el.classList.remove('opacity-0');
  ```

- **rAF for mousemove DOM writes**: Batch style mutations inside `mousemove` handlers (e.g., `--x`, `--y` CSS custom properties) with `requestAnimationFrame`. Always cancel pending rAF with `cancelAnimationFrame(rafId)` before scheduling a new one.

- **Bento Tile Headings are `<h2>`**: All section titles inside bento tiles use `<h2>` (not `<h3>`) to maintain correct heading hierarchy after the single `<h1>` (the clock).

- **Font Preloads**: All 6 Inter font weights (300–800) and `Phosphor.woff2` must be declared with `<link rel="preload">` in `index.html`, `impressum.html`, and `datenschutz.html`. Critical weights (400, 600, 700, Phosphor) must appear first.

- **Phosphor Icon Build System**: The full Phosphor CSS source lives at `js/phosphor-full.css` (1530 icons, build-time only, never deployed). `js/compile-icons.js` scans source files for used `ph-*` classes and writes only those rules into the `AUTO-ICONS:START/END` block in `style.src.css`. **To use any new icon, simply add it to the HTML/JS and run `npm run build` — no manual CSS editing required.** Do NOT delete `js/phosphor-full.css`.

- **`<noscript>` fallback is required**: All HTML pages include a `<noscript>` block immediately after `<body>` with a bilingual message when JavaScript is disabled.

- **Dynamic `theme-color` Meta Tag**: `applyTheme()` in `script.src.js` updates `<meta name="theme-color">` on every theme switch. If you add a new theme to the `THEMES` array, also add its background color to the `themeColors` map.

- **`preconnect` implies `dns-prefetch`**: Do not add redundant `<link rel="dns-prefetch">` next to an existing `<link rel="preconnect">` for the same host.

---

## 📂 Project Directory Structure

```yaml
/ (Root)
├── AI_INIT.md              # AI initialization guidelines (this file)
├── CADDYFILE.md            # Production Caddyfile configuration
├── README.md               # Development & deployment documentation
├── package.json            # npm scripts & devDependencies
├── package-lock.json
├── tailwind.config.js      # Tailwind configuration (scan paths)
├── style.src.css           # Source CSS (AUTO-ICONS block + Tailwind + custom styles)
├── script.src.js           # Source JS (all application logic — EDIT THIS FILE)
├── js/
│   ├── phosphor-full.css   # Full Phosphor icon library — BUILD SOURCE ONLY
│   ├── compile-icons.js    # Build step 1: extracts used ph-* icons → style.src.css
│   ├── compile-js.js       # Build step 3: strips comments + minifies script.src.js
│   ├── version-sw.js       # Build step 4: bumps Service Worker cache version
│   └── PHOSPHOR_ICONS.md   # Icon build system documentation
└── www/                    # PRODUCTION STATIC WEB ROOT (deploy only this folder)
    ├── index.html          # Primary bento-box dashboard & link hub
    ├── impressum.html      # Multilingual Imprint / Legal page
    ├── datenschutz.html    # Multilingual Privacy Policy (GDPR/DSGVO)
    ├── script.js           # Compiled JS (minified — DO NOT EDIT)
    ├── sw.js               # Service worker (Network-First PWA caching)
    ├── style.css           # Compiled CSS (purged & minified — DO NOT EDIT)
    ├── manifest.json       # PWA Manifest
    ├── robots.txt          # Search engine exclusion (noindex/nofollow)
    ├── icon.svg            # Koala emoji favicon
    ├── js/
    │   ├── legal.js        # Legal page language toggles & email reveal
    │   └── lang-init.js    # Language initializer (prevents flash)
    ├── fonts/
    │   ├── inter-*.woff2   # Self-hosted Inter font (300, 400, 500, 600, 700, 800)
    │   └── Phosphor.woff2  # Self-hosted Phosphor icon font
    └── api/
        └── weather         # Mock weather JSON (rewritten by Caddy in production)
```

---

## ⚙️ How to Add Tracked Repositories

To append or modify tracked projects in the GitHub Release/Package widget:

1. Open `script.src.js` (NOT `www/script.js` — that is the compiled output).
2. Locate the `repositories` array.
3. Add a new configuration object:

```javascript
const repositories = [
  { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
  { repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
  { repo: 'Shik3i/KoalaBye',            displayName: 'KoalaBye' },
  { repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' },
  { repo: 'Shik3i/KoalaSnippets',       displayName: 'KoalaSnippets', type: 'package' },
  { repo: 'Shik3i/KoalaStartpage',      displayName: 'KoalaStartpage' },
  { repo: 'Shik3i/KoalaCookies',        displayName: 'KoalaCookies' },
  { repo: 'Shik3i/KoalaEdit',           displayName: 'KoalaEdit', type: 'commit' },
  { repo: 'Shik3i/KoalaFinance',        displayName: 'KoalaFinance', type: 'commit' },
  { repo: 'Shik3i/KoalaNotes',          displayName: 'KoalaNotes', type: 'commit' },
  { repo: 'Shik3i/KoalaPull',           displayName: 'KoalaPull' },
  { repo: 'Shik3i/KoalaNews',           displayName: 'KoalaNews', type: 'package', pkgOverride: 'koalanews%2Fkoalanews-website' },
  { repo: 'Shik3i/KoalaLanding',        displayName: 'KoalaLanding', type: 'commit' },
  { repo: 'Shik3i/KoalaShare',          displayName: 'KoalaShare', type: 'commit' },
  { repo: 'Shik3i/KoalaShip',           displayName: 'KoalaShip', type: 'commit' },
  { repo: 'Shik3i/KoalaSnap',           displayName: 'KoalaSnap', type: 'commit' },
  { repo: 'Shik3i/KoalaSound',          displayName: 'KoalaSound' },
  { repo: 'Shik3i/KoalaTower',          displayName: 'KoalaTower', type: 'commit' },
  { repo: 'Shik3i/KoalaTrade',          displayName: 'KoalaTrade', type: 'commit' },
  { repo: 'Shik3i/KoalaWorld',          displayName: 'KoalaWorld', type: 'commit' },
  { repo: 'Owner/YourNewRepo',          displayName: 'FriendlyName' },
];
```

### Release vs. Package Tracking

The tracker supports three modes, controlled by the optional `type` field:

| Mode | `type` value | API Endpoint | Link Target | Use Case |
|------|-------------|-------------|-------------|----------|
| **Release** | omitted / default | `/repos/{owner}/{repo}/releases/latest` | `/{owner}/{repo}/releases` | Projects that publish GitHub Releases with release notes and downloadable assets |
| **Package** | `'package'` | `/repos/{owner}/{repo}/tags` | `/{owner}/{repo}/pkgs/container/{name}` | Projects that publish Docker container images via GitHub Packages — versions are tracked through Git tags rather than formal releases |
| **Commit** | `'commit'` | `/repos/{owner}/{repo}/commits?per_page=1` | `/{owner}/{repo}/commits` | Projects with no release or package yet, tracked by latest commit |

4. **ALWAYS run `npm run build`** after editing `script.src.js` to compile the changes into `www/script.js`.

### Cache Invalidation

The release tracker caches API responses in `localStorage` under `koala-releases-cache-v7` with a 2-hour TTL. If you change a repository's `type` (e.g., from release to package), bump the `CACHE_KEY` version string in `script.src.js` to invalidate stale cached data.

Run `npm run check` before committing. Use `npm run check:external` when you also want to compare the tracker against the public GitHub repo list.

---

**By maintaining the structural patterns, strict GDPR assets, and build flows outlined above, you ensure this dashboard remains the fastest, safest, and most beautiful entry page in the Koala ecosystem.**
