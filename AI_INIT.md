# 🐨 Koala Startpage — AI Initialization & Context Guide

**MANDATORY FIRST READ.** This document outlines the architecture, layout rules, build constraints, and development guidelines for the **Koala Startpage** dashboard. Future AI agents must strictly adhere to these instructions to maintain the site's performance, zero-dependency privacy compliance, and build integrity.

---

## 🏗️ Project Overview & Persona

**Koala Startpage** is a modern, static, high-performance bento-box dashboard serving as the central landing hub for Koala projects (KoalaSync, KoalaWeb, KoalaClicker), service uptimes, internal Tailnet (Tailscale) home server interfaces, and system monitoring tools.

### Key Features
1. **Dynamic Bento Box UI**: Sleek, glassmorphic card layout utilizing responsive Tailwind CSS and custom micro-animations.
2. **GitHub Release Tracker**: Asynchronously fetches latest releases or package tags using the GitHub REST API. Features a 10-minute TTL `localStorage` cache to respect GitHub API rate limits.
3. **Live Clock & Greeting**: Dynamic local greeting system based on the time of day with a live ticking clock (including seconds).
4. **100% Self-Hosted GDPR/DSGVO Privacy**: Absolutely no external CDNs. All assets (fonts like Inter, icons like Phosphor) are served locally.
5. **Zero-Build Production**: All optimized, purged CSS is committed directly to Git. The production VPS serves static files purely (e.g., via Caddy) and requires no Node.js or NPM build steps on deployment.
6. **Bilingual i18n Support**: Full German (DE) and English (EN) toggle, preserving language state in `localStorage`.

---

## 🛠️ Tech Stack & Build Pipeline

- **Core**: HTML5, Vanilla ES6 JavaScript (zero external framework overhead).
- **Styling**: Tailwind CSS v3 (using static utility classes) integrated with custom HSL gradient overlays and glassmorphism.
- **Build Pipeline**: Tailwind CSS CLI.
  - **Source CSS**: `style.src.css` (contains `@tailwind` directives, `@font-face` definitions, and custom CSS components).
  - **Scanned Files**: `index.html`, `impressum.html`, `datenschutz.html`, `script.js`.
  - **Compiled CSS**: `style.css` (purged and minified for production).
- **Service Worker**: `sw.js` registers a caching strategy for PWA support and offline resilience.

---

## 🤖 AI Development Directives & Rules

### 1. 🔒 Git Branch Hygiene (CRITICAL)
Before executing edits or terminal commands, **always run `git status` and `git branch`**. Ensure you are on the `main` branch (unless instructed otherwise by the user) and pull latest commits. 

### 2. ⚡ Tailwind Recompilation Protocol (MANDATORY)
Since Tailwind classes are purged:
- Whenever you add, change, or remove CSS classes in `index.html`, `impressum.html`, `datenschutz.html`, or `script.js`, **you MUST run the compilation build command**:
  ```bash
  npm run build
  ```
- Failure to run this command will result in newly used Tailwind classes not being compiled into `style.css`, causing broken styling in production.
- During active development, you can also spin up watch mode:
  ```bash
  npm run watch
  ```

### 3. 🛡️ Strict GDPR & Content Security Policy (CSP)
- **NO external script/style CDNs** are allowed.
- All fonts (`fonts/inter-*.woff2`) and icons (`fonts/Phosphor.woff2`) are committed in the `/fonts` directory. Do not load fonts from Google Fonts API or icons from unpkg/jsdelivr.
- Connect-src is locked strictly to `'self'` and `https://api.github.com`.

### 4. 🌐 Multilingual i18n Strategy
The project uses a dual approach for localization:
1. **Dynamic Dashboard Translations (`index.html` / `script.js`)**:
   - Element tags in `index.html` are decorated with `data-i18n="translation_key"`.
   - Translations are defined in the `translations` object inside `script.js`.
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

### 5. 🔒 Spam Protection & Email Obfuscation
To prevent bot crawler scraping, **never write plain email addresses in raw HTML**.
- Use the class `.email-trigger` combined with `data-user` and `data-domain` attributes:
  ```html
  <span class="email-trigger" data-user="admin" data-domain="koalastuff.net">[Show Email]</span>
  ```
- `js/legal.js` attaches event listeners that reconstruct the address upon an active user click event.

---

## 📂 Project Directory Structure

```yaml
/
├── index.html            # Primary bento-box dashboard & link hub
├── impressum.html        # Multilingual Imprint / Legal page (voluntary DDG compliance)
├── datenschutz.html      # Multilingual Privacy Policy (GDPR/DSGVO compliant)
├── script.js             # Core clock, i18n toggles, relative times, and GitHub tracker
├── sw.js                 # Service worker (PWA cache strategy)
├── style.src.css         # Source CSS containing Tailwind components and custom styles
├── style.css             # Compiled, minified, and purged stylesheet (DO NOT EDIT directly)
├── manifest.json         # PWA Manifest configuration
├── package.json          # Node scripts for CSS compilation (devDependencies only)
├── tailwind.config.js    # Tailwind scanner paths and config
├── robots.txt            # Search engine exclusion (dashboard is private/noindex)
├── icon.svg              # SVG branding icon (koala emoji favicon)
├── js/
│   └── legal.js          # Handles legal page language toggles and email reveal click listeners
└── fonts/
    ├── inter-*.woff2     # Self-hosted Inter font variants (300, 400, 500, 600, 700, 800)
    ├── phosphor.css      # Phosphor Icons utility stylesheet
    └── Phosphor.woff2    # Self-hosted Phosphor font file
```

---

## ⚙️ How to Add Tracked Repositories

To append or modify tracked projects in the GitHub Release widget:
1. Open `script.js`.
2. Locate the `repositories` array (~line 175).
3. Add a new configuration object:
   ```javascript
   const repositories = [
     { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
     { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' }, // Uses Tag release checks
     { repo: 'Owner/YourNewRepo',          displayName: 'FriendlyName' }
   ];
   ```
4. Standard repositories retrieve latest tag names via GitHub Releases API.
5. If the project publishes a package rather than a standard release, specify `type: 'package'` to crawl tags instead.

**By maintaining the structural patterns, strict GDPR assets, and build flows outlined above, you ensure this dashboard remains the fastest, safest, and most beautiful entry page in the Koala ecosystem.**
