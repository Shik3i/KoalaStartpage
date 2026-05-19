const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '../www/sw.js');
if (!fs.existsSync(swPath)) {
  console.error('[SW Versioning] sw.js not found!');
  process.exit(1);
}

let swContent = fs.readFileSync(swPath, 'utf8');

// Generate unique timestamp version based on current time (e.g. v202605180915)
const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12);
const newCacheName = `const CACHE_NAME = 'koala-startpage-v${timestamp}';`;

// Regex matches const CACHE_NAME = 'koala-startpage-...'; regardless of version string
const cacheNameRegex = /const CACHE_NAME = 'koala-startpage-[^']+';/;

if (cacheNameRegex.test(swContent)) {
  swContent = swContent.replace(cacheNameRegex, newCacheName);
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log(`[SW Versioning] Successfully bumped cache name to: koala-startpage-v${timestamp}`);
} else {
  console.error('[SW Versioning] Could not find CACHE_NAME definition in sw.js!');
  process.exit(1);
}
