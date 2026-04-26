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
const assetFiles = fs.readdirSync(finalAssetsPath);
const mainJs = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
const mainCss = assetFiles.find(f => f.startsWith('styles-') && f.endsWith('.css'));

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
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${mainJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);
console.log(`Successfully generated index.html pointing to ${mainJs}`);
