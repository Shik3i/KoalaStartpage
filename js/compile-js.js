const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../script.src.js');
const destPath = path.join(__dirname, '../www/script.js');

try {
  let content = fs.readFileSync(srcPath, 'utf8');

  // 1. Remove multi-line comments /* ... */
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Remove single-line comments // while respecting strings and protocols
  // Line-by-line string-aware parser (handles '', "", `` and escaped chars)
  content = content.split(/\r?\n/).map(line => {
    let inStr = false;
    let strChar = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (ch === strChar) inStr = false;
      } else {
        if (ch === '"' || ch === "'" || ch === '`') {
          inStr = true;
          strChar = ch;
        } else if (ch === '/' && line[i + 1] === '/') {
          return line.substring(0, i).trimEnd();
        }
      }
    }
    return line;
  }).join('\n');

  // 3. Compress lines (trim, remove empty lines)
  const minifiedLines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const result = minifiedLines.join('\n');

  fs.writeFileSync(destPath, result, 'utf8');
  console.log(`[JS Compiler] Successfully compiled script.src.js to www/script.js.`);
  console.log(`[JS Compiler] Original: ${fs.statSync(srcPath).size} bytes. Minified: ${fs.statSync(destPath).size} bytes.`);
} catch (err) {
  console.error('[JS Compiler] Error during JS compilation:', err);
  process.exit(1);
}
