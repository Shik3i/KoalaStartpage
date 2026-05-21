/**
 * compile-icons.js
 * ─────────────────────────────────────────────────────────────────
 * Scans all source files for used Phosphor icon classes (ph-*),
 * extracts only those rules from the full Phosphor CSS, and writes
 * a compact icon block into style.src.css — replacing the previous
 * manually maintained block automatically.
 *
 * Source:  js/phosphor-full.css  (build-time only, never deployed)
 * Target:  style.src.css         (between AUTO-ICONS markers)
 * ─────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

// Files to scan for ph-* class usage
const SCAN_FILES = [
  'www/index.html',
  'www/impressum.html',
  'www/datenschutz.html',
  'script.src.js',
].map(f => path.join(ROOT, f));

const PHOSPHOR_FULL = path.join(__dirname, 'phosphor-full.css');
const STYLE_SRC     = path.join(ROOT, 'style.src.css');

// Markers that delimit the auto-generated block inside style.src.css
const MARKER_START = '/* AUTO-ICONS:START */';
const MARKER_END   = '/* AUTO-ICONS:END */';

// ── Step 1: Collect used icon names ──────────────────────────────

const usedIcons = new Set();
const iconRegex = /\bph-([a-z0-9]+(?:-[a-z0-9]+)*)\b/g;

for (const filePath of SCAN_FILES) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = iconRegex.exec(content)) !== null) {
    usedIcons.add('ph-' + match[1]);
  }
}

console.log(`[Icons] Found ${usedIcons.size} unique ph-* classes across source files.`);

// ── Step 2: Parse phosphor-full.css into a lookup map ────────────
// Format in file:  .ph.ph-cube:before {\n  content: "\\e1c6";\n}

const fullCss  = fs.readFileSync(PHOSPHOR_FULL, 'utf8');

// Build a map: iconName → content value  e.g. "ph-cube" → "\\e1c6"
const lookup   = new Map();
// Match blocks like: .ph.ph-cube:before {\n  content: "\e1c6";\n}
const blockRe  = /\.ph\.(ph-[a-z0-9-]+):before\s*\{\s*content:\s*"(\\[^"]+)";\s*\}/g;
let m;
while ((m = blockRe.exec(fullCss)) !== null) {
  lookup.set(m[1], m[2]);
}

console.log(`[Icons] Phosphor library contains ${lookup.size} icons total.`);

// ── Step 3: Build the extracted CSS block ────────────────────────

const missing = [];
const lines   = [];

for (const icon of [...usedIcons].sort()) {
  if (icon === 'ph') continue; // skip the base class itself
  const content = lookup.get(icon);
  if (!content) {
    missing.push(icon);
    continue;
  }
  // Write in the project's established format: .ph-cube:before { ... }
  lines.push(`.${icon}:before { content: "${content}"; }`);
}

if (missing.length) {
  console.warn(`[Icons] WARNING — ${missing.length} icon(s) not found in phosphor-full.css:`);
  missing.forEach(i => console.warn(`         • ${i}`));
}

const generatedBlock =
  `${MARKER_START}\n` +
  `/* Auto-generated — do not edit manually. Run: npm run build */\n` +
  `/* NOTE: The .ph base class (font-family binding) lives BELOW this block and is NOT auto-generated. */\n` +
  lines.join('\n') + '\n' +
  MARKER_END;

// ── Step 4: Inject into style.src.css ────────────────────────────

let styleSrc = fs.readFileSync(STYLE_SRC, 'utf8');

const startIdx = styleSrc.indexOf(MARKER_START);
const endIdx   = styleSrc.indexOf(MARKER_END);

if (startIdx !== -1 && endIdx !== -1) {
  // Replace existing auto block
  styleSrc =
    styleSrc.slice(0, startIdx) +
    generatedBlock +
    styleSrc.slice(endIdx + MARKER_END.length);
} else {
  // No markers yet — replace the old manual icon block.
  // The manual block starts at "/* Optimized Phosphor Icons Helper */"
  // and ends just before "/* ── Local Phosphor Icons Font */".
  const manualStart = styleSrc.indexOf('/* Optimized Phosphor Icons Helper */');
  const fontStart   = styleSrc.indexOf('/* ── Local Phosphor Icons Font');

  if (manualStart !== -1 && fontStart !== -1) {
    styleSrc =
      generatedBlock + '\n\n' +
      styleSrc.slice(fontStart);
    console.log('[Icons] Replaced legacy manual icon block with auto-generated block.');
  } else {
    // Fallback: prepend to file
    styleSrc = generatedBlock + '\n\n' + styleSrc;
    console.log('[Icons] Prepended auto-generated icon block (no existing block found).');
  }
}

fs.writeFileSync(STYLE_SRC, styleSrc, 'utf8');

console.log(`[Icons] ✓ Wrote ${lines.length} icon rule(s) into style.src.css.`);
