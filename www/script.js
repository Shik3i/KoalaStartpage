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
    tile_extensions: 'Erweiterungen',
    tile_services: 'Services',
    tile_releases: 'Latest Releases',
    link_uptime: 'Status-Seite',
    link_sync: 'KoalaSync',
    link_timer: 'KoalaWeb',
    link_snippets: 'KoalaSnippets',
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
  },
  en: {
    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    greeting_night: 'Good Night',
    tile_extensions: 'Extensions',
    tile_services: 'Services',
    tile_releases: 'Latest Releases',
    link_uptime: 'Status Page',
    link_sync: 'KoalaSync',
    link_timer: 'KoalaWeb',
    link_snippets: 'KoalaSnippets',
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
  }
};

let currentLang = localStorage.getItem('koala-lang') || 'de';
let cachedReleases = null;
let cachedWeatherData = null;

function t(key) {
  return translations[currentLang]?.[key] || translations.de[key] || key;
}

// ── Init ────────────────────────────────────────
initLangToggle();
applyLanguage();
initClock();

// Defer GitHub API and Weather calls to idle time to free up CPU/network for initial paint
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

// Register Service Worker for offline capability (PWA) asynchronously
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
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  if (typeof updateClock === 'function') updateClock();

  if (cachedReleases) {
    const container = document.getElementById('releases-container');
    renderReleases(cachedReleases, container);
  }

  if (cachedWeatherData) {
    renderWeather(cachedWeatherData);
  }
}

// ── Clock & Greeting ────────────────────────────
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

// ── Relative Time ───────────────────────────────
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

// ── GitHub Releases ─────────────────────────────
const repositories = [
  { repo: 'Shik3i/KoalaSync',           displayName: 'KoalaSync' },
  { repo: 'Shik3i/KoalaClicker',        displayName: 'KoalaClicker' },
  { repo: 'Shik3i/FlyffUniverseHelper', displayName: 'KoalaFlyff' },
  { repo: 'Shik3i/Antigrav',            displayName: 'KoalaWeb', type: 'package' },
  { repo: 'Shik3i/KoalaSnippets',       displayName: 'KoalaSnippets' },
  { repo: 'Shik3i/KoalaStartpage',      displayName: 'KoalaStartpage' },
];

const CACHE_KEY = 'koala-releases-cache-v2';
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours (safeguards against GitHub API rate-limiting)

async function fetchGitHubReleases() {
  const container = document.getElementById('releases-container');

  // Check cache first
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      // Restore date objects from ISO strings
      cachedReleases = cached.data.map(r => ({ ...r, date: r.date ? new Date(r.date) : null }));
      renderReleases(cachedReleases, container);
      return;
    }
  } catch (e) { /* ignore corrupt cache */ }

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
          } catch (e) { /* ignore commit fetch error */ }
          
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

    // If ALL failed (likely rate limited), try to use stale cache
    const allFailed = releases.every(r => r.status === 'error');
    if (allFailed) {
      try {
        const stale = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (stale && stale.data) {
          cachedReleases = stale.data.map(r => ({ ...r, date: r.date ? new Date(r.date) : null }));
          renderReleases(cachedReleases, container);
          return;
        }
      } catch (e) { /* no stale cache */ }
    }

    releases.sort((a, b) => {
      if (a.date && b.date) return b.date - a.date;
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    cachedReleases = releases;

    // Save to cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: releases }));
    } catch (e) { /* storage full */ }

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

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="ph ph-github-logo text-xl ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity"></i>
        <div class="flex flex-col">
          <span class="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">${rel.displayName}</span>
          <span class="text-xs ${tagColor}">${tagText}</span>
        </div>
      </div>
      <div class="text-xs text-gray-600 flex items-center gap-2 group-hover:text-gray-400 transition-colors">
        <span>${timeAgo}</span>
        <i class="ph ph-arrow-up-right text-xs"></i>
      </div>
    `;

    container.appendChild(item);
  });
}

// ── Weather API Reverse Proxy Fetcher ───────────
const WEATHER_CACHE_KEY = 'koala-weather-cache';
const WEATHER_CACHE_TTL = 60 * 60 * 1000; // 1 hour (weather is highly stable)

const weatherMap = {
  0: { icon: 'ph-sun', text: { de: 'Sonnig', en: 'Sunny' } },
  1: { icon: 'ph-cloud-sun', text: { de: 'Leicht bewölkt', en: 'Mainly Clear' } },
  2: { icon: 'ph-cloud-sun', text: { de: 'Teils bewölkt', en: 'Partly Cloudy' } },
  3: { icon: 'ph-cloud', text: { de: 'Bedeckt', en: 'Overcast' } },
  45: { icon: 'ph-cloud-fog', text: { de: 'Nebel', en: 'Fog' } },
  48: { icon: 'ph-cloud-fog', text: { de: 'Raureifnebel', en: 'Depositing Rime Fog' } },
  51: { icon: 'ph-cloud-rain', text: { de: 'Leichter Niesel', en: 'Light Drizzle' } },
  53: { icon: 'ph-cloud-rain', text: { de: 'Nieselregen', en: 'Moderate Drizzle' } },
  55: { icon: 'ph-cloud-rain', text: { de: 'Starker Niesel', en: 'Dense Drizzle' } },
  61: { icon: 'ph-cloud-rain', text: { de: 'Leichter Regen', en: 'Slight Rain' } },
  63: { icon: 'ph-cloud-rain', text: { de: 'Regen', en: 'Moderate Rain' } },
  65: { icon: 'ph-cloud-rain', text: { de: 'Starker Regen', en: 'Heavy Rain' } },
  71: { icon: 'ph-cloud-snow', text: { de: 'Leichter Schneefall', en: 'Slight Snow' } },
  73: { icon: 'ph-cloud-snow', text: { de: 'Schneefall', en: 'Moderate Snow' } },
  75: { icon: 'ph-cloud-snow', text: { de: 'Starker Schneefall', en: 'Heavy Snow' } },
  77: { icon: 'ph-snowflake', text: { de: 'Schneegriesel', en: 'Snow Grains' } },
  80: { icon: 'ph-cloud-rain', text: { de: 'Regenschauer', en: 'Slight Showers' } },
  81: { icon: 'ph-cloud-rain', text: { de: 'Starke Schauer', en: 'Moderate Showers' } },
  82: { icon: 'ph-cloud-rain', text: { de: 'Heftige Schauer', en: 'Violent Showers' } },
  85: { icon: 'ph-cloud-snow', text: { de: 'Schneeschauer', en: 'Slight Snow Showers' } },
  86: { icon: 'ph-cloud-snow', text: { de: 'Starke Schneeschauer', en: 'Heavy Snow Showers' } },
  95: { icon: 'ph-cloud-lightning', text: { de: 'Gewitter', en: 'Thunderstorm' } },
  96: { icon: 'ph-cloud-lightning', text: { de: 'Gewitter mit Hagel', en: 'Thunderstorm with Hail' } },
  99: { icon: 'ph-cloud-lightning', text: { de: 'Schweres Gewitter mit Hagel', en: 'Heavy Thunderstorm with Hail' } }
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

  // Try loading cache first
  try {
    const cached = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY));
    if (cached && (Date.now() - cached.timestamp) < WEATHER_CACHE_TTL) {
      renderWeather(cached.data);
      return;
    }
  } catch (e) { /* ignore corrupt cache */ }

  try {
    const res = await fetch('/api/weather');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Save to cache
    try {
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) { /* storage full */ }

    renderWeather(data);
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    // Fallback to stale cache if API failed
    try {
      const stale = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY));
      if (stale && stale.data) {
        renderWeather(stale.data);
      }
    } catch (e) { /* no stale cache */ }
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

  // Render current weather
  const currentTemp = Math.round(current.temperature_2m);
  const currentCode = current.weather_code;
  const currentCondition = weatherMap[currentCode] || { icon: 'ph-sun', text: { de: 'Sonnig', en: 'Sunny' } };

  tempEl.textContent = `${currentTemp}°C`;
  iconEl.className = `ph ${currentCondition.icon} text-amber-400 text-lg`;
  tempEl.title = currentCondition.text[currentLang];
  cachedWeatherData = data;

  // Render 3-day forecast
  forecastEl.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const dateStr = daily.time[i];
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weather_code[i];
    const condition = weatherMap[code] || { icon: 'ph-sun', text: { de: 'Sonnig', en: 'Sunny' } };
    
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
      <i class="ph ${condition.icon} text-indigo-400/80 my-0.5 text-xs" title="${condition.text[currentLang]}"></i>
      <span class="text-white font-semibold">${maxTemp}°<span class="text-gray-600 font-normal text-[8px]">${minTemp}°</span></span>
    `;
    forecastEl.appendChild(dayCol);
  }

  // Smoothly fade in the widget
  widget.classList.remove('hidden');
  void widget.offsetWidth; // Reflow
  widget.classList.remove('opacity-0');
  widget.classList.add('opacity-100');
}
