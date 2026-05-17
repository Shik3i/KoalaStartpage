function setLegalLang(lang) {
    var html = document.documentElement;
    html.classList.remove('lang-en', 'lang-de');
    html.classList.add('lang-' + lang);
    html.lang = lang;
    localStorage.setItem('koala-lang', lang);
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
        el.addEventListener('click', function() {
            const user = this.getAttribute('data-user') || 'admin';
            const domain = this.getAttribute('data-domain') || 'koalastuff.net';
            this.textContent = user + '@' + domain;
        });
    });
});
