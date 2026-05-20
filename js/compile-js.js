const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../script.src.js');
const destPath = path.join(__dirname, '../www/script.js');

try {
  let content = fs.readFileSync(srcPath, 'utf8');

  // 1. Remove multi-line comments /* ... */
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Remove single-line comments // (ignoring http:// or https://)
  // We match // except where it is preceded by a colon (:) or is inside quotes.
  // A safe approach for our specific file is replacing lines ending with // comments,
  // making sure not to touch protocol strings like http:// or https://.
  content = content.replace(/(^|[^:])\/\/.*$/gm, '$1');

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
