import fs from 'fs';
import path from 'path';

const distPath = path.resolve('dist');
const assetsPath = path.join(distPath, 'assets');

// Find the main JS bundle (largest) and CSS file (largest)
const files = fs.readdirSync(assetsPath);
const mainJs = files
  .filter(f => f.startsWith('index-') && f.endsWith('.js'))
  .map(f => ({ name: f, size: fs.statSync(path.join(assetsPath, f)).size }))
  .sort((a, b) => b.size - a.size)[0]?.name;

const mainCss = files
  .filter(f => f.startsWith('styles-') && f.endsWith('.css'))
  .map(f => ({ name: f, size: fs.statSync(path.join(assetsPath, f)).size }))
  .sort((a, b) => b.size - a.size)[0]?.name;

if (!mainJs) {
  console.error('Could not find main JS bundle!');
  process.exit(1);
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>M.A.T. Furniture Showroom</title>
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}">` : ''}
    <script>
      window.onerror = function(msg, url, line, col, error) {
        console.error("Global error caught:", msg, "at", url, ":", line);
      };
      window.onunhandledrejection = function(event) {
        console.error("Unhandled promise rejection:", event.reason);
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${mainJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);
console.log(`Successfully generated index.html pointing to ${mainJs}`);
