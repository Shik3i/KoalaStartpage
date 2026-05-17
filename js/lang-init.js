(function() {
    var s = localStorage.getItem('koala-lang');
    var l = s || (navigator.language.startsWith('de') ? 'de' : 'en');
    document.documentElement.lang = l;
    
    // For legal pages, add the appropriate class immediately to prevent language flash
    if (document.location.pathname.includes('impressum') || document.location.pathname.includes('datenschutz')) {
        document.documentElement.classList.add('lang-' + l);
    }
})();

// Register Service Worker for offline capability (PWA)
if ('serviceWorker' in navigator) {
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
