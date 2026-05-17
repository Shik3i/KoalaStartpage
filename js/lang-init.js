(function() {
    var s = localStorage.getItem('koala-lang');
    var l = s || (navigator.language.startsWith('de') ? 'de' : 'en');
    document.documentElement.lang = l;
    
    // For legal pages, add the appropriate class immediately to prevent language flash
    if (document.location.pathname.includes('impressum') || document.location.pathname.includes('datenschutz')) {
        document.documentElement.classList.add('lang-' + l);
    }
})();
