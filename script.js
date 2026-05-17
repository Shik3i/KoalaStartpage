document.addEventListener('DOMContentLoaded', () => {
    initClock();
    fetchGitHubReleases();
});

function initClock() {
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const greetingElement = document.getElementById('greeting');

    function update() {
        const now = new Date();
        
        // Time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;

        // Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('de-DE', options);

        // Greeting
        const hour = now.getHours();
        let greeting = 'Guten Abend';
        if (hour >= 5 && hour < 12) {
            greeting = 'Guten Morgen';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Guten Tag';
        } else if (hour >= 22 || hour < 5) {
            greeting = 'Gute Nacht';
        }
        greetingElement.textContent = greeting;
    }

    update();
    setInterval(update, 1000);
}

const repositories = [
    'Shik3i/KoalaSync',
    'Shik3i/KoalaClicker',
    'Shik3i/KoalaFlyff',
    'Shik3i/KoalaTimer'
];

async function fetchGitHubReleases() {
    const container = document.getElementById('releases-container');
    container.innerHTML = '<div class="text-sm text-gray-400 p-2">Lade Releases...</div>';

    try {
        const releases = await Promise.all(repositories.map(async (repo) => {
            try {
                const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
                if (!response.ok) {
                    if (response.status === 404) return { repo, tag: 'Kein Release', url: `https://github.com/${repo}/releases`, date: null };
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return {
                    repo,
                    tag: data.tag_name,
                    url: data.html_url,
                    date: new Date(data.published_at)
                };
            } catch (err) {
                console.error(`Fehler beim Laden von ${repo}:`, err);
                return { repo, tag: 'Fehler', url: `https://github.com/${repo}/releases`, date: null };
            }
        }));

        // Sort by date descending
        releases.sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return b.date - a.date;
        });

        renderReleases(releases, container);

    } catch (error) {
        container.innerHTML = `<div class="text-sm text-red-400 p-2">Fehler beim Laden der Releases.</div>`;
    }
}

function renderReleases(releases, container) {
    container.innerHTML = '';
    
    releases.forEach(rel => {
        const repoName = rel.repo.split('/')[1];
        const dateStr = rel.date ? rel.date.toLocaleDateString('de-DE') : 'N/A';
        
        const item = document.createElement('a');
        item.href = rel.url;
        item.target = '_blank';
        item.className = 'bento-link flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0 text-gray-200 no-underline group border border-transparent hover:border-gray-700/50';
        
        item.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="ph ph-github-logo text-2xl text-gray-400 group-hover:text-white transition-colors"></i>
                <div class="flex flex-col">
                    <span class="font-medium text-sm group-hover:text-white transition-colors">${repoName}</span>
                    <span class="text-xs text-gray-500">${rel.tag}</span>
                </div>
            </div>
            <div class="text-xs text-gray-500 flex items-center gap-2">
                <span>${dateStr}</span>
                <i class="ph ph-caret-right text-gray-600 group-hover:text-gray-400 transition-colors"></i>
            </div>
        `;
        
        container.appendChild(item);
    });
}
