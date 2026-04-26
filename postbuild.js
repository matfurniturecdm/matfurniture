import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distPath = path.resolve('dist');
const clientPath = path.join(distPath, 'client');
const assetsPath = path.join(distPath, 'assets');

// 1. Move files from dist/client to dist
if (fs.existsSync(clientPath)) {
  const files = fs.readdirSync(clientPath);
  files.forEach(file => {
    const src = path.join(clientPath, file);
    const dest = path.join(distPath, file);
    if (fs.statSync(src).isDirectory()) {
       // For directories, we need to handle existing ones or use a recursive copy
       if (fs.existsSync(dest)) {
         // Simple merge for assets
         const subFiles = fs.readdirSync(src);
         subFiles.forEach(f => fs.renameSync(path.join(src, f), path.join(dest, f)));
       } else {
         fs.renameSync(src, dest);
       }
    } else {
      fs.renameSync(src, dest);
    }
  });
  fs.rmdirSync(clientPath, { recursive: true });
}

// 2. Remove server folder if it exists
const serverPath = path.join(distPath, 'server');
if (fs.existsSync(serverPath)) {
  fs.rmdirSync(serverPath, { recursive: true });
}

// 3. Generate index.html
const finalAssetsPath = path.join(distPath, 'assets');
if (!fs.existsSync(finalAssetsPath)) {
  console.error('Assets directory not found in dist!');
  process.exit(1);
}

const assetFiles = fs.readdirSync(finalAssetsPath);

// Find the LARGEST JS bundle (the main entry) and LARGEST CSS file
const mainJs = assetFiles
  .filter(f => f.startsWith('index-') && f.endsWith('.js'))
  .map(f => ({ name: f, size: fs.statSync(path.join(finalAssetsPath, f)).size }))
  .sort((a, b) => b.size - a.size)[0]?.name;

const mainCss = assetFiles
  .filter(f => f.startsWith('styles-') && f.endsWith('.css'))
  .map(f => ({ name: f, size: fs.statSync(path.join(finalAssetsPath, f)).size }))
  .sort((a, b) => b.size - a.size)[0]?.name;

if (!mainJs) {
  console.error('Could not find main JS bundle (index-*.js)!');
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
