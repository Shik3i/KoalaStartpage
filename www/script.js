const storage = (function() {
try {
const test = '__storage_test__';
window.localStorage.setItem(test, test);
window.localStorage.removeItem(test);
return window.localStorage;
} catch (e) {
const mem = {};
return {
getItem: (key) => mem[key] || null,
setItem: (key, val) => { mem[key] = String(val); },
removeItem: (key) => { delete mem[key]; }
};
}
})();
const translations = {
de: {
greeting_morning: 'Guten Morgen',
greeting_afternoon: 'Guten Tag',
greeting_evening: 'Guten Abend',
greeting_night: 'Gute Nacht',
tile_extensions: 'Erweiterungen',
tile_services: 'Websites',
tile_releases: 'Latest Releases',
link_uptime: 'Status-Seite',
link_sync: 'KoalaSync',
link_blog: 'KoalaBlog',
link_timer: 'KoalaWeb',
link_sub_timer: 'Timer',
link_esports: 'Esports',
link_news: 'News',
link_wordle: 'Wordle',
link_colorsync: 'Color Sync',
link_lotto: 'Lotto',
link_scratchcards: 'Rubbellose',
releases_loading: 'Lade Releases…',
releases_error: 'Fehler beim Laden der Releases.',
releases_none: 'Kein Release',
releases_fail: 'Fehler',
footer_privacy: 'Datenschutz',
footer_imprint: 'Impressum',
date_locale: 'de-DE',
tile_internal: 'Intern (Tailscale)',
label_tailscale_only: 'Nur im Tailnet erreichbar',
time_just_now: 'Gerade eben',
time_minutes_ago: 'vor {n} Min.',
time_hours_ago: 'vor {n} Std.',
time_days_ago: 'vor {n} Tagen',
time_weeks_ago: 'vor {n} Wochen',
time_months_ago: 'vor {n} Monaten',
search_placeholder_google: 'Google Suche...',
search_placeholder_duckduckgo: 'DuckDuckGo Suche...',
search_placeholder_youtube: 'YouTube Suche...',
open_on_github: 'auf GitHub öffnen',
tooltip_timer: 'KoalaWeb Timer — Online-Stoppuhr & Wecker',
tooltip_esports: 'KoalaWeb Esports — Livestreams & Turniere',
tooltip_news: 'KoalaWeb News — Aktuelle Nachrichten',
tooltip_wordle: 'KoalaWeb Wordle — Das tägliche Worträtsel',
tooltip_colorsync: 'KoalaWeb Color Sync — Farbpaletten-Generator',
tooltip_lotto: 'KoalaWeb Lotto — Glückszahlen-Generator',
tooltip_scratchcards: 'KoalaWeb Rubbellose — Virtueller Rubbelspaß',
tooltip_github: 'GitHub-Profil von Shik3i besuchen',
tooltip_uptime: 'Status-Seite der Websites anzeigen',
tooltip_sync: 'KoalaSync-App öffnen',
tooltip_blog: 'KoalaBlog lesen',
tooltip_legal_privacy: 'Datenschutzerklärung lesen',
tooltip_legal_imprint: 'Impressum lesen',
tooltip_source_code: 'Quellcode auf GitHub ansehen',
tooltip_lang_de: 'Sprache auf Deutsch umstellen',
tooltip_lang_en: 'Sprache auf Englisch umstellen',
tooltip_search_engine: 'Suchmaschine wechseln',
tooltip_dockge: 'Dockge — Container-Verwaltung öffnen',
tooltip_grafana: 'Grafana — Server-Metriken & Monitoring',
tooltip_duplicati_hetzner: 'Duplicati — HetznerBox Backup-Verwaltung',
tooltip_duplicati_unraid: 'Duplicati — UnraidBox Backup-Verwaltung',
tooltip_unraid: 'Unraid Web-Oberfläche öffnen',
tooltip_cstore: 'Im Chrome Web Store ansehen',
tooltip_addons: 'Als Firefox-Addon ansehen',
btn_design: 'Design',
theme_midnight: 'Midnight Aurora',
theme_sunset: 'Sunset Rose',
theme_emerald: 'Emerald Glass',
theme_obsidian: 'Classic Obsidian',
theme_frost: 'Nordic Frost',
theme_cyberpunk: 'Cyberpunk Neon',
theme_solar: 'Solar Amber',
tooltip_change_theme: 'Design wechseln',
},
en: {
greeting_morning: 'Good Morning',
greeting_afternoon: 'Good Afternoon',
greeting_evening: 'Good Evening',
greeting_night: 'Good Night',
tile_extensions: 'Extensions',
tile_services: 'Websites',
tile_releases: 'Latest Releases',
link_uptime: 'Status Page',
link_sync: 'KoalaSync',
link_blog: 'KoalaBlog',
link_timer: 'KoalaWeb',
link_sub_timer: 'Timer',
link_esports: 'Esports',
link_news: 'News',
link_wordle: 'Wordle',
link_colorsync: 'Color Sync',
link_lotto: 'Lotto',
link_scratchcards: 'Scratchcards',
releases_loading: 'Loading releases…',
releases_error: 'Failed to load releases.',
releases_none: 'No release',
releases_fail: 'Error',
footer_privacy: 'Privacy Policy',
footer_imprint: 'Imprint',
date_locale: 'en-US',
tile_internal: 'Internal (Tailscale)',
label_tailscale_only: 'Tailnet only',
time_just_now: 'Just now',
time_minutes_ago: '{n}m ago',
time_hours_ago: '{n}h ago',
time_days_ago: '{n}d ago',
time_weeks_ago: '{n}w ago',
time_months_ago: '{n}mo ago',
search_placeholder_google: 'Search Google...',
search_placeholder_duckduckgo: 'Search DuckDuckGo...',
search_placeholder_youtube: 'Search YouTube...',
open_on_github: 'open on GitHub',
tooltip_timer: 'KoalaWeb Timer — Online Stopwatch & Alarm',
tooltip_esports: 'KoalaWeb Esports — Livestreams & Tournaments',
tooltip_news: 'KoalaWeb News — Daily News Feed',
tooltip_wordle: 'KoalaWeb Wordle — Daily Word Puzzle',
tooltip_colorsync: 'KoalaWeb Color Sync — Color Palette Generator',
tooltip_lotto: 'KoalaWeb Lotto — Lucky Numbers Generator',
tooltip_scratchcards: 'KoalaWeb Scratchcards — Virtual Scratchcards',
tooltip_github: 'Visit Shik3i\'s GitHub profile',
tooltip_uptime: 'View websites status page',
tooltip_sync: 'Open KoalaSync app',
tooltip_blog: 'Read KoalaBlog',
tooltip_legal_privacy: 'Read Privacy Policy',
tooltip_legal_imprint: 'Read Imprint',
tooltip_source_code: 'View source code on GitHub',
tooltip_lang_de: 'Switch language to German',
tooltip_lang_en: 'Switch language to English',
tooltip_search_engine: 'Change search engine',
tooltip_dockge: 'Open Dockge — Container Management',
tooltip_grafana: 'Grafana — Server Metrics & Monitoring',
tooltip_duplicati_hetzner: 'Duplicati — HetznerBox Backup Management',
tooltip_duplicati_unraid: 'Duplicati — UnraidBox Backup Management',
tooltip_unraid: 'Open Unraid Web Interface',
tooltip_cstore: 'View in Chrome Web Store',
tooltip_addons: 'View in Firefox Add-ons',
btn_design: 'Design',
theme_midnight: 'Midnight Aurora',
theme_sunset: 'Sunset Rose',
theme_emerald: 'Emerald Glass',
theme_obsidian: 'Classic Obsidian',
theme_frost: 'Nordic Frost',
theme_cyberpunk: 'Cyberpunk Neon',
theme_solar: 'Solar Amber',
tooltip_change_theme: 'Change design theme',
}
};
const engineConfigs = {
google: {
action: 'https://www.google.com/search',
name: 'q',
placeholder: 'search_placeholder_google'
},
duckduckgo: {
action: 'https://duckduckgo.com/',
name: 'q',
placeholder: 'search_placeholder_duckduckgo'
},
youtube: {
action: 'https://www.youtube.com/results',
name: 'search_query',
placeholder: 'search_placeholder_youtube'
}
};
let currentLang = storage.getItem('koala-lang') || (navigator.language.startsWith('de') ? 'de' : 'en');
let cachedReleases = null;
let cachedWeatherData = null;
function t(key) {
return translations[currentLang]?.[key] || translations.de[key] || key;
}
function escapeHTML(str) {
if (!str) return '';
const div = document.createElement('div');
div.textContent = str;
return div.innerHTML;
}
initLangToggle();
applyLanguage();
initThemeSwitcher();
initClock();
initSearchShortcut();
initTileSpotlight();
initTooltips();
if ('requestIdleCallback' in window) {
requestIdleCallback(() => {
fetchGitHubReleases();
fetchWeather();
}, { timeout: 2000 });
} else {
setTimeout(() => {
fetchGitHubReleases();
fetchWeather();
}, 800);
}
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
window.addEventListener('load', function() {
navigator.serviceWorker.register('./sw.js')
.then(function(registration) {
console.log('[Service Worker] Registered successfully with scope:', registration.scope);
})
.catch(function(err) {
console.log('[Service Worker] Registration failed:', err);
});
});
}
function initLangToggle() {
const btnDE = document.getElementById('lang-de');
const btnEN = document.getElementById('lang-en');
function setActive() {
btnDE.classList.toggle('active', currentLang === 'de');
btnEN.classList.toggle('active', currentLang === 'en');
}
btnDE.addEventListener('click', () => {
currentLang = 'de';
storage.setItem('koala-lang', 'de');
setActive();
applyLanguage();
});
btnEN.addEventListener('click', () => {
currentLang = 'en';
storage.setItem('koala-lang', 'en');
setActive();
applyLanguage();
});
setActive();
}
function applyLanguage() {
document.documentElement.lang = currentLang;
document.documentElement.classList.remove('lang-de', 'lang-en');
document.documentElement.classList.add('lang-' + currentLang);
document.querySelectorAll('[data-i18n]').forEach(el => {
el.textContent = t(el.dataset.i18n);
});
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
el.placeholder = t(el.dataset.i18nPlaceholder);
});
document.querySelectorAll('[data-i18n-title]').forEach(el => {
const translation = t(el.dataset.i18nTitle);
if (el.dataset.tooltip !== undefined) {
el.dataset.tooltip = translation;
} else {
el.setAttribute('title', translation);
}
});
const shortcutBadge = document.getElementById('search-shortcut-badge');
if (shortcutBadge) {
const isMac = navigator.userAgent.includes('Mac');
if (isMac) {
shortcutBadge.textContent = '⌘K';
} else {
shortcutBadge.textContent = currentLang === 'de' ? 'Strg+K' : 'Ctrl+K';
}
}
if (typeof updateClock === 'function') updateClock();
if (cachedReleases) {
const container = document.getElementById('releases-container');
renderReleases(cachedReleases, container);
}
if (cachedWeatherData) {
renderWeather(cachedWeatherData);
}
}
function updateClock() {
const timeEl = document.getElementById('current-time');
const dateEl = document.getElementById('current-date');
const greetEl = document.getElementById('greeting');
const now = new Date();
const h = String(now.getHours()).padStart(2, '0');
const m = String(now.getMinutes()).padStart(2, '0');
const s = String(now.getSeconds()).padStart(2, '0');
timeEl.innerHTML = `${h}<span class="clock-colon">:</span>${m}<span class="text-3xl md:text-5xl text-gray-500 ml-2 font-light">${s}</span>`;
const locale = t('date_locale');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateEl.textContent = now.toLocaleDateString(locale, options);
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
function relativeTime(date) {
if (!date) return '—';
const now = new Date();
const diffMs = now - date;
const diffMins = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMs / 3600000);
const diffDays = Math.floor(diffMs / 86400000);
const diffWeeks = Math.floor(diffDays / 7);
const diffMonths = Math.floor(diffDays / 30);
if (diffMins < 1) return t('time_just_now');
if (diffMins < 60) return t('time_minutes_ago').replace('{n}', diffMins);
if (diffHours < 24) return t('time_hours_ago').replace('{n}', diffHours);
if (diffDays < 7) return t('time_days_ago').replace('{n}', diffDays);
if (diffWeeks < 5) return t('time_weeks_ago').replace('{n}', diffWeeks);
return t('time_months_ago').replace('{n}', diffMonths);
}
const repositories = [
{ repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
{ repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
{ repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
{ repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' },
{ repo: 'Shik3i/KoalaStartpage',      displayName: 'KoalaStartpage' },
];
const CACHE_KEY = 'koala-releases-cache-v2';
const CACHE_TTL = 2 * 60 * 60 * 1000;
async function fetchGitHubReleases() {
const container = document.getElementById('releases-container');
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const isDataSaver = connection && (connection.saveData || connection.effectiveType === '2g');
try {
const cached = JSON.parse(storage.getItem(CACHE_KEY));
if (cached) {
cachedReleases = cached.data.map(r => ({ ...r, date: r.date ? new Date(r.date) : null }));
renderReleases(cachedReleases, container);
const isExpired = (Date.now() - cached.timestamp) >= CACHE_TTL;
if (isDataSaver && isExpired) {
console.log('[Data-Saver] Using expired releases cache to save bandwidth.');
return;
}
if (!isExpired) {
return;
}
}
} catch (e) {  }
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
const releases = await Promise.all(repositories.map(async (item) => {
const isPackage = item.type === 'package';
const owner = item.repo.split('/')[0];
const repoName = item.repo.split('/')[1];
const pkgName = repoName.toLowerCase();
const apiUrl = isPackage
? `https://api.github.com/repos/${item.repo}/tags`
: `https://api.github.com/repos/${item.repo}/releases/latest`;
const fallbackUrl = isPackage
? `https://github.com/${item.repo}/pkgs/container/${pkgName}`
: `https://github.com/${item.repo}/releases`;
try {
const response = await fetch(apiUrl);
if (!response.ok) {
if (response.status === 404) {
return { displayName: item.displayName, tag: null, url: fallbackUrl, date: null, status: 'none' };
}
throw new Error(`HTTP ${response.status}`);
}
const data = await response.json();
if (isPackage) {
if (!data || data.length === 0) {
return { displayName: item.displayName, tag: null, url: fallbackUrl, date: null, status: 'none' };
}
const latestTag = data[0];
let date = null;
try {
const commitRes = await fetch(latestTag.commit.url);
if (commitRes.ok) {
const commitData = await commitRes.json();
date = new Date(commitData.commit.author.date);
}
} catch (e) {  }
return {
displayName: item.displayName,
tag: latestTag.name,
url: fallbackUrl,
date: date,
status: 'ok'
};
} else {
return {
displayName: item.displayName,
tag: data.tag_name,
url: data.html_url,
date: new Date(data.published_at),
status: 'ok'
};
}
} catch (err) {
console.error(`Error loading ${item.displayName}:`, err);
return { displayName: item.displayName, tag: null, url: fallbackUrl, date: null, status: 'error' };
}
}));
const allFailed = releases.every(r => r.status === 'error');
if (allFailed) {
try {
const stale = JSON.parse(storage.getItem(CACHE_KEY));
if (stale && stale.data) {
cachedReleases = stale.data.map(r => ({ ...r, date: r.date ? new Date(r.date) : null }));
renderReleases(cachedReleases, container);
return;
}
} catch (e) {  }
}
releases.sort((a, b) => {
if (a.date && b.date) return b.date - a.date;
if (a.date) return -1;
if (b.date) return 1;
return 0;
});
cachedReleases = releases;
try {
storage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: releases }));
} catch (e) {  }
renderReleases(releases, container);
} catch (error) {
container.innerHTML = `<div class="text-sm text-red-400/80 p-3">${t('releases_error')}</div>`;
}
}
function renderReleases(releases, container) {
container.innerHTML = '';
const colors = ['text-indigo-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400', 'text-purple-400'];
releases.forEach((rel, i) => {
const iconColor = colors[i % colors.length];
const timeAgo = relativeTime(rel.date);
let tagText = rel.tag || '';
if (rel.status === 'none') tagText = t('releases_none');
if (rel.status === 'error') tagText = t('releases_fail');
const tagColor = rel.status === 'ok' ? 'text-gray-400' : (rel.status === 'error' ? 'text-red-400/60' : 'text-gray-600');
const item = document.createElement('a');
item.href = rel.url;
item.target = '_blank';
item.rel = 'noopener';
item.className = 'bento-link flex items-center justify-between p-3 rounded-xl mb-1.5 last:mb-0 text-gray-200 no-underline group';
item.setAttribute('title', `${rel.displayName} — ${t('open_on_github')}`);
item.innerHTML = `
<div class="flex items-center gap-3">
<i class="ph ph-github-logo text-xl ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity"></i>
<div class="flex flex-col">
<span class="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">${escapeHTML(rel.displayName)}</span>
<span class="text-xs ${tagColor}">${escapeHTML(tagText)}</span>
</div>
</div>
<div class="text-xs text-gray-600 flex items-center gap-2 group-hover:text-gray-400 transition-colors">
<span>${escapeHTML(timeAgo)}</span>
<i class="ph ph-arrow-up-right text-xs"></i>
</div>
`;
container.appendChild(item);
});
}
const WEATHER_CACHE_KEY = 'koala-weather-cache';
const WEATHER_CACHE_TTL = 60 * 60 * 1000;
const weatherSVGs = {
sun: `<svg class="svg-weather svg-weather--sun w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="12" cy="12" r="4" fill="currentColor"></circle>
<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
</svg>`,
cloud: `<svg class="svg-weather svg-weather--cloud w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M17.5 19H9a3.5 3.5 0 0 1 0-7h.5A5 5 0 0 1 19 13a3.5 3.5 0 0 1-1.5 6z" fill="currentColor" fill-opacity="0.15"></path>
</svg>`,
'cloud-sun': `<svg class="svg-weather svg-weather--cloud-sun w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<g class="sun-group text-amber-400">
<circle cx="12" cy="10" r="3" fill="currentColor"></circle>
<path d="M12 5v1M12 14v1M8.46 6.46l.7.7M14.83 12.83l.7.7M5 10h1M18 10h1M6.46 13.54l.7-.7M16.95 6.46l-.7.7"></path>
</g>
<path class="cloud-path text-gray-400" d="M17.5 19H9a3.5 3.5 0 0 1 0-7h.5A5 5 0 0 1 19 13a3.5 3.5 0 0 1-1.5 6z" fill="currentColor" fill-opacity="0.15"></path>
</svg>`,
rain: `<svg class="svg-weather svg-weather--rain w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path class="cloud-path text-gray-400" d="M17 17H9a3 3 0 0 1 0-6h.4A4.29 4.29 0 0 1 18 12a3 3 0 0 1-1 5z" fill="currentColor" fill-opacity="0.15"></path>
<g class="rain-group text-sky-400">
<line class="rain-drop rain-drop--1" x1="9" y1="17" x2="9" y2="21"></line>
<line class="rain-drop rain-drop--2" x1="12" y1="18" x2="12" y2="22"></line>
<line class="rain-drop rain-drop--3" x1="15" y1="17" x2="15" y2="21"></line>
</g>
</svg>`,
snow: `<svg class="svg-weather svg-weather--snow w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path class="cloud-path text-gray-400" d="M17 17H9a3 3 0 0 1 0-6h.4A4.29 4.29 0 0 1 18 12a3 3 0 0 1-1 5z" fill="currentColor" fill-opacity="0.15"></path>
<g class="snow-group text-sky-200">
<circle class="snowflake snowflake--1" cx="9" cy="18" r="0.8" fill="currentColor"></circle>
<circle class="snowflake snowflake--2" cx="12" cy="20" r="0.8" fill="currentColor"></circle>
<circle class="snowflake snowflake--3" cx="15" cy="18" r="0.8" fill="currentColor"></circle>
</g>
</svg>`,
lightning: `<svg class="svg-weather svg-weather--lightning w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path class="cloud-path text-gray-400" d="M17 17H9a3 3 0 0 1 0-6h.4A4.29 4.29 0 0 1 18 12a3 3 0 0 1-1 5z" fill="currentColor" fill-opacity="0.15"></path>
<polygon class="lightning-bolt text-yellow-400" points="13 15 9 19 12 19 11 23 15 19 12 19 13 15" fill="currentColor"></polygon>
</svg>`,
fog: `<svg class="svg-weather svg-weather--fog w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path class="cloud-path" d="M17 14.5H9a3 3 0 0 1 0-6h.4A4.29 4.29 0 0 1 18 9.5a3 3 0 0 1-1 5z" fill="currentColor" fill-opacity="0.15"></path>
<g class="fog-lines text-gray-500">
<line class="fog-line fog-line--1" x1="6" y1="17.5" x2="18" y2="17.5"></line>
<line class="fog-line fog-line--2" x1="8" y1="20.5" x2="16" y2="20.5"></line>
</g>
</svg>`
};
const weatherMap = {
0: { icon: 'sun', text: { de: 'Sonnig', en: 'Sunny' } },
1: { icon: 'cloud-sun', text: { de: 'Leicht bewölkt', en: 'Mainly Clear' } },
2: { icon: 'cloud-sun', text: { de: 'Teils bewölkt', en: 'Partly Cloudy' } },
3: { icon: 'cloud', text: { de: 'Bedeckt', en: 'Overcast' } },
45: { icon: 'fog', text: { de: 'Nebel', en: 'Fog' } },
48: { icon: 'fog', text: { de: 'Raureifnebel', en: 'Depositing Rime Fog' } },
51: { icon: 'rain', text: { de: 'Leichter Niesel', en: 'Light Drizzle' } },
53: { icon: 'rain', text: { de: 'Nieselregen', en: 'Moderate Drizzle' } },
55: { icon: 'rain', text: { de: 'Starker Niesel', en: 'Dense Drizzle' } },
61: { icon: 'rain', text: { de: 'Leichter Regen', en: 'Slight Rain' } },
63: { icon: 'rain', text: { de: 'Regen', en: 'Moderate Rain' } },
65: { icon: 'rain', text: { de: 'Starker Regen', en: 'Heavy Rain' } },
71: { icon: 'snow', text: { de: 'Leichter Schneefall', en: 'Slight Snow' } },
73: { icon: 'snow', text: { de: 'Schneefall', en: 'Moderate Snow' } },
75: { icon: 'snow', text: { de: 'Starker Schneefall', en: 'Heavy Snow' } },
77: { icon: 'snow', text: { de: 'Schneegriesel', en: 'Snow Grains' } },
80: { icon: 'rain', text: { de: 'Regenschauer', en: 'Slight Showers' } },
81: { icon: 'rain', text: { de: 'Starke Schauer', en: 'Moderate Showers' } },
82: { icon: 'rain', text: { de: 'Heftige Schauer', en: 'Violent Showers' } },
85: { icon: 'snow', text: { de: 'Schneeschauer', en: 'Slight Snow Showers' } },
86: { icon: 'snow', text: { de: 'Starke Schneeschauer', en: 'Heavy Snow Showers' } },
95: { icon: 'lightning', text: { de: 'Gewitter', en: 'Thunderstorm' } },
96: { icon: 'lightning', text: { de: 'Gewitter mit Hagel', en: 'Thunderstorm with Hail' } },
99: { icon: 'lightning', text: { de: 'Schweres Gewitter mit Hagel', en: 'Heavy Thunderstorm with Hail' } }
};
function getWeekday(dateString, lang) {
const d = new Date(dateString);
const weekdays = {
de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
return weekdays[lang][d.getDay()];
}
async function fetchWeather() {
const widget = document.getElementById('weather-widget');
const tempEl = document.getElementById('weather-temp');
const iconEl = document.getElementById('weather-icon');
const forecastEl = document.getElementById('weather-forecast');
if (!widget || !tempEl || !iconEl || !forecastEl) return;
const MOCK_WEATHER = {
current: {
temperature_2m: 19.5,
weather_code: 0
},
daily: {
time: [
new Date().toISOString().split('T')[0],
new Date(Date.now() + 86400000).toISOString().split('T')[0],
new Date(Date.now() + 172800000).toISOString().split('T')[0]
],
temperature_2m_max: [22, 24, 21],
temperature_2m_min: [11, 12, 10],
weather_code: [0, 1, 2]
}
};
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const isDataSaver = connection && (connection.saveData || connection.effectiveType === '2g');
try {
const cached = JSON.parse(storage.getItem(WEATHER_CACHE_KEY));
if (cached) {
renderWeather(cached.data);
const isExpired = (Date.now() - cached.timestamp) >= WEATHER_CACHE_TTL;
if (isDataSaver && isExpired) {
console.log('[Data-Saver] Using expired weather cache to save bandwidth.');
return;
}
if (!isExpired) {
return;
}
}
} catch (e) {  }
try {
const res = await fetch('/api/weather');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
try {
storage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
} catch (e) {  }
renderWeather(data);
} catch (error) {
console.warn('Failed to fetch real-time weather, attempting cached/mock fallback:', error);
try {
const stale = JSON.parse(storage.getItem(WEATHER_CACHE_KEY));
if (stale && stale.data) {
renderWeather(stale.data);
return;
}
} catch (e) {  }
console.log('[Weather] Displaying fallback local mock weather data');
renderWeather(MOCK_WEATHER);
}
}
function renderWeather(data) {
const widget = document.getElementById('weather-widget');
const tempEl = document.getElementById('weather-temp');
const iconEl = document.getElementById('weather-icon');
const forecastEl = document.getElementById('weather-forecast');
if (!widget || !tempEl || !iconEl || !forecastEl) return;
const current = data.current;
const daily = data.daily;
if (!current || !daily) return;
const currentTemp = Math.round(current.temperature_2m);
const currentCode = current.weather_code;
const currentCondition = weatherMap[currentCode] || { icon: 'sun', text: { de: 'Sonnig', en: 'Sunny' } };
tempEl.textContent = `${currentTemp}°C`;
iconEl.className = 'flex items-center justify-center';
iconEl.innerHTML = weatherSVGs[currentCondition.icon] || weatherSVGs['sun'];
tempEl.title = currentCondition.text[currentLang];
cachedWeatherData = data;
forecastEl.innerHTML = '';
for (let i = 0; i < 3; i++) {
const dateStr = daily.time[i];
const maxTemp = Math.round(daily.temperature_2m_max[i]);
const minTemp = Math.round(daily.temperature_2m_min[i]);
const code = daily.weather_code[i];
const condition = weatherMap[code] || { icon: 'sun', text: { de: 'Sonnig', en: 'Sunny' } };
let dayLabel = '';
if (i === 0) {
dayLabel = currentLang === 'de' ? 'Heute' : 'Today';
} else {
dayLabel = getWeekday(dateStr, currentLang);
}
const dayCol = document.createElement('div');
dayCol.className = 'flex flex-col items-center min-w-[45px]';
dayCol.innerHTML = `
<span class="text-gray-500 font-medium mb-0.5">${dayLabel}</span>
<span class="flex items-center justify-center my-0.5 text-xs" title="${condition.text[currentLang]}">
${weatherSVGs[condition.icon] || weatherSVGs['sun']}
</span>
<span class="text-white font-semibold">${maxTemp}°<span class="text-gray-600 font-normal text-[8px]">${minTemp}°</span></span>
`;
forecastEl.appendChild(dayCol);
}
widget.classList.remove('hidden');
requestAnimationFrame(() => {
widget.classList.remove('opacity-0');
widget.classList.add('opacity-100');
});
}
function initSearchShortcut() {
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const engineBtn = document.getElementById('engine-btn');
const engineBtnIcon = document.getElementById('engine-btn-icon');
const engineDropdown = document.getElementById('engine-dropdown');
if (!searchInput || !searchForm || !engineBtn || !engineDropdown) return;
Object.keys(engineConfigs).forEach(key => {
const btn = engineDropdown.querySelector(`button[data-engine="${key}"]`);
if (btn) {
const svgEl = btn.querySelector('svg');
if (svgEl) {
engineConfigs[key].svg = svgEl.outerHTML;
}
}
});
let currentEngine = storage.getItem('koala-search-engine') || 'google';
if (!engineConfigs[currentEngine]) currentEngine = 'google';
function applyEngine(engineKey) {
const config = engineConfigs[engineKey];
if (!config) return;
currentEngine = engineKey;
storage.setItem('koala-search-engine', engineKey);
searchForm.action = config.action;
searchInput.name = config.name;
searchInput.dataset.i18nPlaceholder = config.placeholder;
searchInput.placeholder = t(config.placeholder);
engineBtn.innerHTML = config.svg;
}
applyEngine(currentEngine);
engineBtn.addEventListener('click', e => {
e.stopPropagation();
engineDropdown.classList.toggle('active');
});
engineDropdown.querySelectorAll('[data-engine]').forEach(btn => {
btn.addEventListener('click', e => {
e.stopPropagation();
const selected = btn.dataset.engine;
applyEngine(selected);
engineDropdown.classList.remove('active');
searchInput.focus();
});
});
document.addEventListener('click', () => {
engineDropdown.classList.remove('active');
});
const engineItems = Array.from(engineDropdown.querySelectorAll('[data-engine]'));
engineBtn.addEventListener('keydown', e => {
if (e.key === 'ArrowDown') {
e.preventDefault();
if (!engineDropdown.classList.contains('active')) {
engineDropdown.classList.add('active');
}
engineItems[0]?.focus();
}
});
engineDropdown.addEventListener('keydown', e => {
const currentIndex = engineItems.indexOf(document.activeElement);
if (currentIndex === -1) return;
if (e.key === 'ArrowDown') {
e.preventDefault();
engineItems[(currentIndex + 1) % engineItems.length].focus();
} else if (e.key === 'ArrowUp') {
e.preventDefault();
engineItems[(currentIndex - 1 + engineItems.length) % engineItems.length].focus();
} else if (e.key === 'Home') {
e.preventDefault();
engineItems[0].focus();
} else if (e.key === 'End') {
e.preventDefault();
engineItems[engineItems.length - 1].focus();
} else if (e.key === 'Escape') {
e.preventDefault();
engineDropdown.classList.remove('active');
engineBtn.focus();
} else if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
const selected = engineItems[currentIndex].dataset.engine;
applyEngine(selected);
engineDropdown.classList.remove('active');
searchInput.focus();
}
});
window.addEventListener('keydown', e => {
if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
e.preventDefault();
searchInput.focus();
searchInput.select();
}
if (e.key === 'Escape') {
if (engineDropdown.classList.contains('active')) {
engineDropdown.classList.remove('active');
} else if (document.activeElement === searchInput) {
searchInput.blur();
}
}
});
}
function initTileSpotlight() {
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;
if (prefersReduced || isMobile) {
return;
}
const tiles = document.querySelectorAll('.bento-tile');
tiles.forEach(tile => {
let rect = null;
tile.addEventListener('mouseenter', () => {
rect = tile.getBoundingClientRect();
});
let rafId = null;
tile.addEventListener('mousemove', e => {
if (!rect) {
rect = tile.getBoundingClientRect();
}
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
cancelAnimationFrame(rafId);
rafId = requestAnimationFrame(() => {
tile.style.setProperty('--x', `${x}px`);
tile.style.setProperty('--y', `${y}px`);
});
});
tile.addEventListener('mouseleave', () => {
tile.style.removeProperty('--x');
tile.style.removeProperty('--y');
rect = null;
});
});
}
function initTooltips() {
const tooltip = document.createElement('div');
tooltip.id = 'custom-tooltip';
tooltip.className = 'custom-tooltip';
document.body.appendChild(tooltip);
let activeElement = null;
document.addEventListener('mouseover', e => {
const target = e.target.closest('[title], [data-tooltip], [data-i18n-title], [aria-label]');
if (!target) return;
if (!target.hasAttribute('title') && !target.dataset.tooltip && !target.dataset.i18nTitle && target.hasAttribute('aria-label')) {
const ariaText = target.getAttribute('aria-label').trim().toLowerCase();
const visibleText = target.textContent.trim().toLowerCase();
if (ariaText === visibleText || visibleText.includes(ariaText)) {
return;
}
}
if (target.hasAttribute('title') && target.getAttribute('title').trim() === '') return;
if (target.dataset.tooltip && target.dataset.tooltip.trim() === '') return;
if (target.hasAttribute('aria-label') && target.getAttribute('aria-label').trim() === '') return;
if (target.hasAttribute('title')) {
target.dataset.tooltip = target.getAttribute('title');
target.removeAttribute('title');
}
const text = target.dataset.tooltip || target.getAttribute('aria-label');
if (!text) return;
activeElement = target;
tooltip.textContent = text;
tooltip.classList.add('visible');
positionTooltip();
});
document.addEventListener('mouseout', e => {
if (!activeElement) return;
const related = e.relatedTarget;
if (related && activeElement.contains(related)) return;
if (activeElement.dataset.tooltip) {
activeElement.setAttribute('title', activeElement.dataset.tooltip);
}
tooltip.classList.remove('visible');
activeElement = null;
});
window.addEventListener('scroll', positionTooltip, { passive: true });
window.addEventListener('resize', positionTooltip, { passive: true });
function positionTooltip() {
if (!activeElement) return;
const rect = activeElement.getBoundingClientRect();
const tooltipRect = tooltip.getBoundingClientRect();
let left = rect.left + (rect.width - tooltipRect.width) / 2;
let top = rect.top - tooltipRect.height - 8;
if (left < 8) left = 8;
if (left + tooltipRect.width > window.innerWidth - 8) {
left = window.innerWidth - tooltipRect.width - 8;
}
if (top < 8) {
top = rect.bottom + 8;
}
tooltip.style.left = `${left}px`;
tooltip.style.top = `${top}px`;
}
}
function initThemeSwitcher() {
const container = document.getElementById('design-container');
const btn = document.getElementById('design-btn');
const dropdown = document.getElementById('design-dropdown');
const items = document.querySelectorAll('.design-item');
if (!container || !btn || !dropdown) return;
const THEMES = ['midnight', 'sunset', 'emerald', 'obsidian', 'frost', 'cyberpunk', 'solar'];
let currentTheme = storage.getItem('koala-theme') || 'midnight';
if (!THEMES.includes(currentTheme)) currentTheme = 'midnight';
function applyTheme(themeName) {
currentTheme = themeName;
storage.setItem('koala-theme', themeName);
THEMES.forEach(t => document.documentElement.classList.remove(`theme-${t}`));
document.documentElement.classList.add(`theme-${themeName}`);
const themeColors = {
midnight: '#09090b', sunset: '#0b0709', emerald: '#050806',
obsidian: '#030303', frost:   '#05090e', cyberpunk: '#0c020b', solar: '#0f0702'
};
const metaTheme = document.querySelector('meta[name="theme-color"]');
if (metaTheme) metaTheme.setAttribute('content', themeColors[themeName] || '#09090b');
items.forEach(item => {
const itemTheme = item.dataset.theme;
const check = item.querySelector('.check-icon');
const isActive = itemTheme === themeName;
item.classList.toggle('active', isActive);
item.setAttribute('aria-selected', isActive ? 'true' : 'false');
if (check) {
check.classList.toggle('hidden', !isActive);
}
});
btn.setAttribute('aria-expanded', 'false');
}
applyTheme(currentTheme);
let hoverTimeout = null;
let closeTimeout = null;
container.addEventListener('mouseenter', () => {
clearTimeout(closeTimeout);
hoverTimeout = setTimeout(() => {
dropdown.classList.add('active');
btn.setAttribute('aria-expanded', 'true');
}, 180);
});
container.addEventListener('mouseleave', () => {
clearTimeout(hoverTimeout);
closeTimeout = setTimeout(() => {
dropdown.classList.remove('active');
btn.setAttribute('aria-expanded', 'false');
}, 350);
});
btn.addEventListener('click', e => {
e.stopPropagation();
if (!dropdown.classList.contains('active')) {
dropdown.classList.add('active');
btn.setAttribute('aria-expanded', 'true');
}
});
items.forEach(item => {
item.addEventListener('click', e => {
e.stopPropagation();
const themeName = item.dataset.theme;
applyTheme(themeName);
dropdown.classList.remove('active');
});
});
document.addEventListener('click', e => {
if (!container.contains(e.target)) {
dropdown.classList.remove('active');
btn.setAttribute('aria-expanded', 'false');
}
});
container.addEventListener('focusout', () => {
setTimeout(() => {
if (!container.contains(document.activeElement)) {
dropdown.classList.remove('active');
btn.setAttribute('aria-expanded', 'false');
}
}, 50);
});
container.addEventListener('keydown', e => {
const activeEl = document.activeElement;
const isBtnFocused = activeEl === btn;
const isItemFocused = Array.from(items).includes(activeEl);
const isOpen = dropdown.classList.contains('active');
if (e.key === 'Escape') {
if (isOpen) {
e.preventDefault();
dropdown.classList.remove('active');
btn.setAttribute('aria-expanded', 'false');
btn.focus();
}
} else if (e.key === 'ArrowDown') {
e.preventDefault();
if (!isOpen) {
dropdown.classList.add('active');
btn.setAttribute('aria-expanded', 'true');
items[0].focus();
} else if (isBtnFocused) {
items[0].focus();
} else if (isItemFocused) {
const index = Array.from(items).indexOf(activeEl);
const nextIndex = (index + 1) % items.length;
items[nextIndex].focus();
}
} else if (e.key === 'ArrowUp') {
e.preventDefault();
if (!isOpen) {
dropdown.classList.add('active');
btn.setAttribute('aria-expanded', 'true');
items[items.length - 1].focus();
} else if (isBtnFocused) {
items[items.length - 1].focus();
} else if (isItemFocused) {
const index = Array.from(items).indexOf(activeEl);
const prevIndex = (index - 1 + items.length) % items.length;
items[prevIndex].focus();
}
} else if (e.key === 'Home') {
if (isOpen && isItemFocused) {
e.preventDefault();
items[0].focus();
}
} else if (e.key === 'End') {
if (isOpen && isItemFocused) {
e.preventDefault();
items[items.length - 1].focus();
}
}
});
}