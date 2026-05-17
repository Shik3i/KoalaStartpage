/* ═══════════════════════════════════════════════
   KoalaStartpage — script.js
   i18n, Clock, GitHub Releases
   ═══════════════════════════════════════════════ */

// ── i18n Translations ───────────────────────────
const translations = {
  de: {
    greeting_morning: 'Guten Morgen',
    greeting_afternoon: 'Guten Tag',
    greeting_evening: 'Guten Abend',
    greeting_night: 'Gute Nacht',
    tile_status: 'System Status',
    tile_services: 'Services',
    tile_releases: 'Latest Releases',
    link_uptime: 'Status-Seite',
    link_sync: 'KoalaSync',
    link_timer: 'KoalaTimer',
    link_blackjack: 'Blackjack',
    link_esports: 'Esports',
    link_news: 'News',
    releases_loading: 'Lade Releases…',
    releases_error: 'Fehler beim Laden der Releases.',
    releases_none: 'Kein Release',
    releases_fail: 'Fehler',
    footer_privacy: 'Datenschutz',
    footer_imprint: 'Impressum',
    date_locale: 'de-DE',
  },
  en: {
    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    greeting_night: 'Good Night',
    tile_status: 'System Status',
    tile_services: 'Services',
    tile_releases: 'Latest Releases',
    link_uptime: 'Status Page',
    link_sync: 'KoalaSync',
    link_timer: 'KoalaTimer',
    link_blackjack: 'Blackjack',
    link_esports: 'Esports',
    link_news: 'News',
    releases_loading: 'Loading releases…',
    releases_error: 'Failed to load releases.',
    releases_none: 'No release',
    releases_fail: 'Error',
    footer_privacy: 'Privacy Policy',
    footer_imprint: 'Imprint',
    date_locale: 'en-US',
  }
};

let currentLang = localStorage.getItem('koala-lang') || 'de';
let cachedReleases = null;

function t(key) {
  return translations[currentLang]?.[key] || translations.de[key] || key;
}

// ── Init ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLangToggle();
  applyLanguage();
  initClock();
  fetchGitHubReleases();
});

// ── Language Toggle ─────────────────────────────
function initLangToggle() {
  const btnDE = document.getElementById('lang-de');
  const btnEN = document.getElementById('lang-en');

  function setActive() {
    btnDE.classList.toggle('active', currentLang === 'de');
    btnEN.classList.toggle('active', currentLang === 'en');
  }

  btnDE.addEventListener('click', () => {
    currentLang = 'de';
    localStorage.setItem('koala-lang', 'de');
    setActive();
    applyLanguage();
  });

  btnEN.addEventListener('click', () => {
    currentLang = 'en';
    localStorage.setItem('koala-lang', 'en');
    setActive();
    applyLanguage();
  });

  setActive();
}

function applyLanguage() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // Re-render clock immediately for date locale
  if (typeof updateClock === 'function') updateClock();

  // Re-render releases if cached
  if (cachedReleases) {
    const container = document.getElementById('releases-container');
    renderReleases(cachedReleases, container);
  }
}

// ── Clock & Greeting ────────────────────────────
function updateClock() {
  const timeEl = document.getElementById('current-time');
  const dateEl = document.getElementById('current-date');
  const greetEl = document.getElementById('greeting');

  const now = new Date();

  // Time with pulsing colon
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  timeEl.innerHTML = `${h}<span class="clock-colon">:</span>${m}<span class="text-3xl md:text-5xl text-gray-500 ml-2 font-light">${s}</span>`;

  // Date
  const locale = t('date_locale');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString(locale, options);

  // Greeting
  const hour = now.getHours();
  let key = 'greeting_evening';
  if (hour >= 5 && hour < 12) key = 'greeting_morning';
  else if (hour >= 12 && hour < 18) key = 'greeting_afternoon';
  else if (hour >= 22 || hour < 5) key = 'greeting_night';
  greetEl.textContent = t(key);
}

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

// ── GitHub Releases ─────────────────────────────
const repositories = [
  'Shik3i/KoalaSync',
  'Shik3i/KoalaClicker',
  'Shik3i/KoalaFlyff',
  'Shik3i/KoalaTimer',
];

async function fetchGitHubReleases() {
  const container = document.getElementById('releases-container');

  // Show skeleton loaders
  container.innerHTML = Array(repositories.length).fill(0).map(() => `
    <div class="flex items-center justify-between p-3 rounded-xl mb-2">
      <div class="flex items-center gap-3">
        <div class="skeleton w-8 h-8 rounded-lg"></div>
        <div class="flex flex-col gap-1.5">
          <div class="skeleton w-24 h-4"></div>
          <div class="skeleton w-16 h-3"></div>
        </div>
      </div>
      <div class="skeleton w-16 h-3"></div>
    </div>
  `).join('');

  try {
    const releases = await Promise.all(repositories.map(async (repo) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        if (!response.ok) {
          if (response.status === 404) {
            return { repo, tag: null, url: `https://github.com/${repo}/releases`, date: null, status: 'none' };
          }
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
          repo,
          tag: data.tag_name,
          url: data.html_url,
          date: new Date(data.published_at),
          status: 'ok'
        };
      } catch (err) {
        console.error(`Error loading ${repo}:`, err);
        return { repo, tag: null, url: `https://github.com/${repo}/releases`, date: null, status: 'error' };
      }
    }));

    // Sort: releases with dates first (newest first), then no-release, then errors
    releases.sort((a, b) => {
      if (a.date && b.date) return b.date - a.date;
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    cachedReleases = releases;
    renderReleases(releases, container);

  } catch (error) {
    container.innerHTML = `<div class="text-sm text-red-400/80 p-3">${t('releases_error')}</div>`;
  }
}

function renderReleases(releases, container) {
  container.innerHTML = '';

  const colors = ['text-indigo-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400', 'text-purple-400'];

  releases.forEach((rel, i) => {
    const repoName = rel.repo.split('/')[1];
    const locale = t('date_locale');
    const dateStr = rel.date ? rel.date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const iconColor = colors[i % colors.length];

    let tagText = rel.tag || '';
    if (rel.status === 'none') tagText = t('releases_none');
    if (rel.status === 'error') tagText = t('releases_fail');

    const tagColor = rel.status === 'ok' ? 'text-gray-400' : (rel.status === 'error' ? 'text-red-400/60' : 'text-gray-600');

    const item = document.createElement('a');
    item.href = rel.url;
    item.target = '_blank';
    item.rel = 'noopener';
    item.className = 'bento-link flex items-center justify-between p-3 rounded-xl mb-1.5 last:mb-0 text-gray-200 no-underline group';

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="ph ph-github-logo text-xl ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity"></i>
        <div class="flex flex-col">
          <span class="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">${repoName}</span>
          <span class="text-xs ${tagColor}">${tagText}</span>
        </div>
      </div>
      <div class="text-xs text-gray-600 flex items-center gap-2 group-hover:text-gray-400 transition-colors">
        <span>${dateStr}</span>
        <i class="ph ph-arrow-up-right text-xs"></i>
      </div>
    `;

    container.appendChild(item);
  });
}
