function setLegalLang(lang) {
    var html = document.documentElement;
    html.classList.remove('lang-en', 'lang-de');
    html.classList.add('lang-' + lang);
    html.lang = lang;
    try { localStorage.setItem('koala-lang', lang); } catch(e) {}
    updateLegalLangButtons(lang);
}

function updateLegalLangButtons(lang) {
    const deBtn = document.getElementById('legal-lang-de');
    const enBtn = document.getElementById('legal-lang-en');
    if (deBtn) deBtn.classList.toggle('active', lang === 'de');
    if (enBtn) enBtn.classList.toggle('active', lang === 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    // Setup language toggle button event listeners (replaces inline onclick)
    const btnDE = document.getElementById('legal-lang-de');
    const btnEN = document.getElementById('legal-lang-en');
    if (btnDE) btnDE.addEventListener('click', () => setLegalLang('de'));
    if (btnEN) btnEN.addEventListener('click', () => setLegalLang('en'));

    // Initialize button visual states
    const lang = document.documentElement.classList.contains('lang-en') ? 'en' : 'de';
    updateLegalLangButtons(lang);

    // Setup interactive email reveal click listeners (replaces inline onclick)
    const emailTriggers = document.querySelectorAll('.email-trigger');
    emailTriggers.forEach(el => {
        function revealEmail() {
            const user = el.getAttribute('data-user') || 'admin';
            const domain = el.getAttribute('data-domain') || 'koalastuff.net';
            el.textContent = user + '@' + domain;
            el.removeAttribute('role');
            el.removeAttribute('tabindex');
        }
        el.addEventListener('click', revealEmail);
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                revealEmail();
            }
        });
    });
});

// Register Service Worker for offline capability (PWA) asynchronously
// NOTE: This is intentionally duplicated from script.src.js because legal pages
// load legal.js instead of script.js — each page needs its own SW registration.
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
