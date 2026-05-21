# 🐨 Koala Startpage — AI Initialization & Context Guide

**MANDATORY FIRST READ.** This document outlines the architecture, layout rules, build constraints, and development guidelines for the **Koala Startpage** dashboard. Future AI agents must strictly adhere to these instructions to maintain the site's performance, zero-dependency privacy compliance, and build integrity.

> [!IMPORTANT]
> **SOURCE vs COMPILED FILES — CRITICAL:**
> - **EDIT** `script.src.js` (root) — this is the JavaScript source file.
> - **EDIT** `style.src.css` (root) — this is the CSS source file.
> - **NEVER EDIT** `www/script.js` or `www/style.css` directly — these are compiled outputs and will be overwritten on the next `npm run build`.
> - After any change to source files, **ALWAYS run `npm run build`** to compile into the `www/` directory.

---

## 🏗️ Project Overview & Persona

**Koala Startpage** is a modern, static, high-performance bento-box dashboard serving as the central landing hub for Koala projects (KoalaSync, KoalaWeb, KoalaClicker), service uptimes, internal Tailnet (Tailscale) home server interfaces, and system monitoring tools.

### Key Features
1. **Dynamic Bento Box UI**: Sleek, glassmorphic card layout utilizing responsive Tailwind CSS and custom micro-animations. Features a silky-smooth, GPU-accelerated spotlight coordinate transition (`--x`, `--y`) to prevent snapping on mouse hover enter/leave.
2. **GitHub Release Tracker**: Asynchronously fetches latest releases or package tags using the GitHub REST API. Features a **2-hour TTL** `localStorage` cache to respect GitHub API rate limits.
3. **Live Clock & Greeting**: Dynamic local greeting system based on the time of day with a live ticking clock (including seconds).
4. **100% Self-Hosted GDPR/DSGVO Privacy**: Absolutely no external CDNs. All assets (fonts like Inter, icons like Phosphor) are served locally.
5. **Zero-Build Production**: All optimized, purged CSS is committed directly to Git. The production VPS serves static files purely (e.g., via Caddy) and requires no Node.js or NPM build steps on deployment.
6. **Bilingual i18n Support**: Full German (DE) and English (EN) toggle, preserving language state in `localStorage`. Includes a premium, fully keyboard-accessible WAI-ARIA listbox theme selection dropdown.

---

## 🛠️ Tech Stack & Build Pipeline

- **Core**: HTML5, Vanilla ES6 JavaScript (zero external framework overhead).
- **Styling**: Tailwind CSS v3 (using static utility classes) integrated with custom HSL gradient overlays and glassmorphism.
- **Build Pipeline**: Tailwind CSS CLI.
  - **Source CSS**: `style.src.css` (contains `@tailwind` directives, `@font-face` definitions, and custom CSS components).
  - **Source JS**: `script.src.js` (contains all application logic, i18n, clock, GitHub tracker, weather).
  - **Scanned Files**: `www/index.html`, `www/impressum.html`, `www/datenschutz.html`, `script.src.js`.
  - **Compiled CSS**: `www/style.css` (purged and minified for production).
  - **Compiled JS**: `www/script.js` (minified output — DO NOT EDIT directly).
- **Service Worker**: `www/sw.js` registers a **Network-First falling back to Cache** strategy for PWA support and offline resilience. This ensures that updates to the dashboard (HTML/JS/CSS changes) are served immediately upon page refresh when online, while still providing robust offline availability.

---

## 🤖 AI Development Directives & Rules

### 1. 🔒 Git Branch Hygiene (CRITICAL)
Before executing edits or terminal commands, **always run `git status` and `git branch`**. Ensure you are on the `main` branch (unless instructed otherwise by the user) and pull latest commits. 

### 2. ⚡ Build Protocol (MANDATORY)
The `npm run build` command runs **four steps in sequence**:
1. **`compile-icons.js`** — scans all source files for used `ph-*` Phosphor icon classes and auto-generates the icon CSS block in `style.src.css`
2. **`tailwindcss`** — compiles and purges `style.src.css` → `www/style.css`
3. **`compile-js.js`** — strips comments and minifies `script.src.js` → `www/script.js`
4. **`version-sw.js`** — bumps the Service Worker cache version

Run it whenever you touch HTML, JS or CSS source files:
```bash
npm run build
```

**Tailwind class purging:** Only classes that appear in `www/index.html`, `www/impressum.html`, `www/datenschutz.html`, and `www/script.js` are kept in `style.css`. Failure to rebuild will cause missing styles in production.

During active development, use watch mode (runs Tailwind only — not the full pipeline):
```bash
npm run watch
```

### 3. 🌐 Local Testing & Browser Security (CRITICAL FOR AGENTS)
- **DO NOT attempt to open `file:///` URLs in the browser subagent.** Modern browser security policies block direct local file access, causing browser tests to fail with "access blocked" errors.
- To inspect or test the dashboard locally, **you MUST spin up a local development web server first** and navigate to `http://localhost:<port>` (e.g. `http://localhost:8080`):
  ```bash
  npx http-server -p 8080
  ```
- Once the server is running, let the browser subagent visit `http://localhost:8080`.
- **Always terminate the web server process** (e.g., using standard input `CTRL-C` or terminating the command) after completing your visual checks to avoid orphaned processes.

### 4. 🛡️ Strict GDPR & Content Security Policy (CSP)
- **NO external script/style CDNs** are allowed.
- All fonts (`fonts/inter-*.woff2`) and icons (`fonts/Phosphor.woff2`) are committed in the `/fonts` directory. Do not load fonts from Google Fonts API or icons from unpkg/jsdelivr.
- **NO INLINE SCRIPTS (CRITICAL)**: Do NOT inline external JavaScript files (like `js/lang-init.js` or `js/legal.js`) directly into HTML `<script>` tags, even if page speed audit tools suggest doing so to reduce HTTP requests. The production server enforces a strict Content Security Policy (`script-src 'self'`) which blocks all inline scripts. Inlining scripts will break the dashboard completely unless SHA-256 hashes are manually updated and maintained in the Caddyfile. To avoid this high maintenance overhead, all JavaScript must remain in external `.js` files.
- Connect-src is locked strictly to `'self'` and `https://api.github.com`.

### 5. 🌐 Multilingual i18n Strategy
The project uses a dual approach for localization:
1. **Dynamic Dashboard Translations (`index.html` / `script.src.js`)**:
   - Element tags in `index.html` are decorated with `data-i18n="translation_key"`.
   - Translations are defined in the `translations` object inside `script.src.js`.
   - When the user changes language, `applyLanguage()` runs, querying all elements and substituting text.
2. **Static Document Translations (`impressum.html` / `datenschutz.html`)**:
   - Legal pages utilize direct double markup structure inside the HTML.
   - Elements are duplicated: `<span lang="de">...</span>` and `<span lang="en">...</span>`.
   - The CSS rules automatically handle visibility based on the active class on `<html>` (e.g. `lang-de` or `lang-en`):
     ```css
     .lang-de [lang="en"] { display: none !important; }
     .lang-en [lang="de"] { display: none !important; }
     ```
   - Language toggles on legal pages trigger `setLegalLang(lang)` inside `js/legal.js`.

### 6. 🔒 Spam Protection & Email Obfuscation
To prevent bot crawler scraping, **never write plain email addresses in raw HTML**.
- Use the class `.email-trigger` combined with `data-user` and `data-domain` attributes:
  ```html
  <span class="email-trigger" data-user="admin" data-domain="koalastuff.net">[Show Email]</span>
  ```
- `js/legal.js` attaches event listeners that reconstruct the address upon an active user click event.

### 7. 🏷️ GitHub Tagging & Versioning (CRITICAL)
- **NEVER automatically create, tag, or push release versions to GitHub** (e.g., tags like `v1.1`, `v1.2`, etc.).
- Creating tags or versioned releases must **ONLY occur on explicit user request**. Do not propose or perform automatic version generation or tag creation without direct confirmation and instruction from the user.

### 8. ⚡ Performance Patterns (MANDATORY)
These rules preserve the LCP score and prevent forced layout reflows:

- **LCP Hero Tile — Never hide with opacity:0**: The `.bento-tile--hero` (the clock/greeting tile) uses a special `fadeInHero` animation that starts at `opacity: 1`. Do **NOT** apply the generic `.fade-in` class behavior (which starts at `opacity: 0`) to this tile, as it would delay the browser's LCP measurement by ~3 seconds. The override is defined in `style.src.css` as `.bento-tile--hero.fade-in { opacity: 1; }`.

- **No `void element.offsetWidth` (Forced Reflow forbidden)**: Never use `void el.offsetWidth`, `el.getBoundingClientRect()` immediately followed by a style write, or similar forced-reflow patterns to trigger CSS transitions. Always use `requestAnimationFrame()` instead:
  ```javascript
  // ✅ Correct — no forced reflow:
  el.classList.remove('hidden');
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
  });
  // ❌ Wrong — forces synchronous layout recalculation:
  el.classList.remove('hidden');
  void el.offsetWidth; // FORBIDDEN
  el.classList.remove('opacity-0');
  ```

- **rAF for mousemove DOM writes**: Any DOM style mutations inside `mousemove` handlers (e.g., CSS Custom Properties like `--x`, `--y`) must be batched inside `requestAnimationFrame`. Always cancel pending rAF with `cancelAnimationFrame(rafId)` before scheduling a new one to prevent frame accumulation.

- **Bento Tile Headings are `<h2>`**: All section titles inside bento tiles use `<h2>` (not `<h3>`) to maintain a correct heading hierarchy after the single `<h1>` (the clock). Do not downgrade them to `<h3>`.

- **Font Preloads**: All 6 Inter font weights (300–800) and `Phosphor.woff2` must be declared with `<link rel="preload">` in `index.html`, `impressum.html`, and `datenschutz.html`. Critical weights (400, 600, 700, Phosphor) must appear first. `fetchpriority="high"` must be set on `<script src="js/lang-init.js">` on all three pages.

- **Phosphor Icon Build System (CRITICAL — do NOT break this)**: The project uses an automatic icon extraction pipeline. The full Phosphor CSS source lives at `js/phosphor-full.css` (1530 icons, build-time only, never deployed). Before each build, `js/compile-icons.js` scans all source files for used `ph-*` classes and writes only those CSS rules into a clearly marked `AUTO-ICONS:START/END` block in `style.src.css`. This block is then compiled by Tailwind into `www/style.css`. **To use any new icon, simply add it to the HTML/JS and run `npm run build` — no manual CSS editing required.** See `js/PHOSPHOR_ICONS.md` for full documentation. Do NOT delete `js/phosphor-full.css` — it is the lookup source for this pipeline.
- **`www/fonts/phosphor.css` must NOT be re-created**: The old file at that path was deleted because the icon CSS is now compiled directly into `style.css` via the build pipeline above. Re-adding it would cause duplicate rules and break the build.

- **`<noscript>` fallback is required**: All HTML pages (`index.html`, `impressum.html`, `datenschutz.html`) include a `<noscript>` block immediately after `<body>` that displays a bilingual message when JavaScript is disabled. Preserve this in future edits.

- **Dynamic `theme-color` Meta Tag**: `applyTheme()` in `script.src.js` updates `<meta name="theme-color">` on every theme switch using a `themeColors` map (one hex per theme). If you add a new theme to the `THEMES` array, also add its background color to this map.

- **`preconnect` implies `dns-prefetch`**: Do not add redundant `<link rel="dns-prefetch">` next to an existing `<link rel="preconnect">` for the same host. One `preconnect` is sufficient.

---

## 📂 Project Directory Structure

```yaml
/ (Root)
├── AI_INIT.md            # AI initialization guidelines
├── CADDYFILE.md          # Production Caddyfile guidelines
├── README.md             # Development & local setup guidelines
├── package.json          # npm compile scripts & devDependencies
├── package-lock.json     
├── tailwind.config.js    # Tailwind configuration (updated scan paths)
├── style.src.css         # Source CSS (contains AUTO-ICONS block + Tailwind components)
├── js/
│   ├── phosphor-full.css # Full Phosphor icon library — BUILD SOURCE ONLY, never deployed!
│   ├── compile-icons.js  # Build step 1: auto-extracts used ph-* icons → style.src.css
│   ├── compile-js.js     # Build step 3: strips comments + minifies script.src.js
│   ├── version-sw.js     # Build step 4: bumps Service Worker cache version
│   └── PHOSPHOR_ICONS.md # Documentation for the icon build system
└── www/                  # PRODUCTION STATIC WEB ROOT (Deploy only this folder to the VPS!)
    ├── index.html        # Primary bento-box dashboard & link hub
    ├── impressum.html    # Multilingual Imprint / Legal page (voluntary DDG compliance)
    ├── datenschutz.html  # Multilingual Privacy Policy (GDPR/DSGVO compliant)
    ├── script.js         # Compiled JS output (minified — DO NOT EDIT directly)
    ├── script.src.js     # Source JS (all application logic — EDIT THIS FILE)
    ├── sw.js             # Service worker (Network-First PWA caching strategy)
    ├── style.css         # Compiled, minified, and purged stylesheet (DO NOT EDIT directly)
    ├── manifest.json     # PWA Manifest configuration
    ├── robots.txt        # Search engine exclusion (dashboard is private/noindex)
    ├── icon.svg          # SVG branding icon (koala emoji favicon)
    ├── js/
    │   ├── legal.js      # Handles legal page language toggles and email reveal click listeners
    │   └── lang-init.js  # Language initializer (no flash)
    ├── fonts/
    │   ├── inter-*.woff2 # Self-hosted Inter font variants (300, 400, 500, 600, 700, 800)
    │   └── Phosphor.woff2# Self-hosted Phosphor font file (icon CSS is compiled into style.css)
    └── api/
        └── weather       # Mock weather JSON (rewritten in production by Caddy)
```

---

## ⚙️ How to Add Tracked Repositories

To append or modify tracked projects in the GitHub Release widget:
1. Open `script.src.js` (NOT `www/script.js` — that is the compiled output).
2. Locate the `repositories` array.
3. Add a new configuration object:
   ```javascript
   const repositories = [
     { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
     { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' },
     { repo: 'Shik3i/KoalaSnippets',       displayName: 'KoalaSnippets' },
     { repo: 'Owner/YourNewRepo',          displayName: 'FriendlyName' }
   ];
   ```
4. Standard repositories retrieve latest tag names via GitHub Releases API.
5. If the project publishes a package rather than a standard release, specify `type: 'package'` to crawl tags instead.
6. **ALWAYS run `npm run build` after editing `script.src.js`** to compile the changes into `www/script.js`.

**By maintaining the structural patterns, strict GDPR assets, and build flows outlined above, you ensure this dashboard remains the fastest, safest, and most beautiful entry page in the Koala ecosystem.**
