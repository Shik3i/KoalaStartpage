const fs = require('fs');
const https = require('https');

const source = fs.readFileSync('script.src.js', 'utf8');
const html = fs.readFileSync('www/index.html', 'utf8');
const sitemap = fs.readFileSync('www/sitemap.xml', 'utf8');
const external = process.argv.includes('--external');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readRepositories() {
  const match = source.match(/const repositories = \[([\s\S]*?)\];/);
  if (!match) {
    fail('repositories array not found in script.src.js');
    return [];
  }
  return Array.from(
    match[1].matchAll(/\{ repo: '([^']+)',\s+displayName: '([^']+)'([^}]*)\}/g),
    ([, repo, displayName, config]) => ({
      repo,
      displayName,
      type: /type:\s*'([^']+)'/.exec(config)?.[1] || 'release'
    })
  );
}

function assertUnique(items, key) {
  const seen = new Set();
  for (const item of items) {
    const value = item[key];
    if (seen.has(value)) fail(`duplicate ${key}: ${value}`);
    seen.add(value);
  }
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const headers = { 'User-Agent': 'KoalaStartpage-check', 'Accept': 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 403 && !process.env.GITHUB_TOKEN) {
          console.warn(`Skipping external GitHub check: ${url} returned HTTP 403. Set GITHUB_TOKEN for strict checks.`);
          resolve(null);
          return;
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`${url} returned HTTP ${res.statusCode}`));
          return;
        }
        resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

async function checkExternalRepositories(repositories) {
  const publicRepos = await getJson('https://api.github.com/users/Shik3i/repos?per_page=100&sort=full_name');
  if (!publicRepos) return;
  const publicKoala = publicRepos
    .filter((repo) => !repo.fork && /^Koala/i.test(repo.name))
    .map((repo) => repo.full_name)
    .sort();
  const tracked = new Set(repositories.map((repo) => repo.repo));
  for (const repo of publicKoala) {
    if (!tracked.has(repo)) fail(`public Koala repo missing from tracker: ${repo}`);
  }
}

const repositories = readRepositories();
assertUnique(repositories, 'repo');
assertUnique(repositories, 'displayName');

for (const repo of repositories) {
  if (!['release', 'package', 'commit'].includes(repo.type)) {
    fail(`unsupported tracker type for ${repo.displayName}: ${repo.type}`);
  }
}

for (const required of ['KoalaBye', 'KoalaShip', 'KoalaTrade', 'KoalaTower', 'Hermes']) {
  if (!html.includes(required)) fail(`missing visible link label: ${required}`);
}

if (/KoalaBlog|blog\.koalastuff\.net/.test(html + sitemap)) {
  fail('KoalaBlog is still present in index or sitemap');
}

const openUrls = (sitemap.match(/<url>/g) || []).length;
const closeUrls = (sitemap.match(/<\/url>/g) || []).length;
const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), ([, loc]) => loc);
if (openUrls !== closeUrls) fail(`sitemap url tag mismatch: ${openUrls} open, ${closeUrls} close`);
if (openUrls !== locs.length) fail(`sitemap loc count mismatch: ${openUrls} url blocks, ${locs.length} loc tags`);
assertUnique(locs.map((loc) => ({ loc })), 'loc');

(async () => {
  if (external) await checkExternalRepositories(repositories);
  if (errors.length) {
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`OK: ${repositories.length} tracker entries, ${locs.length} sitemap URLs${external ? ', external repo check' : ''}.`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
