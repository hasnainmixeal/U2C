import { copyFile, readdir, rm, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();

console.log('1. Generating hero viewer...');
execSync('node scripts/generate-hero-viewer.mjs', { stdio: 'inherit' });

console.log('2. Preparing index.html from template...');
await copyFile(path.join(rootDir, 'index.template.html'), path.join(rootDir, 'index.html'));

console.log('3. Running Vite build...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('4. Syncing build output to root for GitHub Pages...');
// Copy dist/index.html to root index.html
await copyFile(path.join(rootDir, 'dist/index.html'), path.join(rootDir, 'index.html'));

// Ensure root assets directory exists
const assetsDir = path.join(rootDir, 'assets');
await mkdir(assetsDir, { recursive: true });

// Clean old bundles from root assets/
const oldAssets = await readdir(assetsDir);
for (const file of oldAssets) {
  if (file.startsWith('index-') && (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map'))) {
    await rm(path.join(assetsDir, file));
  }
}

// Copy new assets from dist/assets to root assets/
const distAssetsDir = path.join(rootDir, 'dist/assets');
const newAssets = await readdir(distAssetsDir);
for (const file of newAssets) {
  await copyFile(path.join(distAssetsDir, file), path.join(assetsDir, file));
}

// Ensure hero-viewer exists at root for GitHub Pages serving from /
const rootHeroViewerDir = path.join(rootDir, 'hero-viewer');
await mkdir(rootHeroViewerDir, { recursive: true });
await copyFile(path.join(rootDir, 'public/hero-viewer/index.html'), path.join(rootHeroViewerDir, 'index.html'));
await copyFile(path.join(rootDir, 'public/hero-viewer/index.js'), path.join(rootHeroViewerDir, 'index.js'));

// Ensure the SOG model files exist at root for GitHub Pages
await copyFile(
  path.join(rootDir, 'public/apollo-moon-lander-astronaut.sog'),
  path.join(rootDir, 'apollo-moon-lander-astronaut.sog')
);
if (await readdir(path.join(rootDir, 'public')).then(f => f.includes('Apollo Moon Lander- Astronaut.sog'))) {
  await copyFile(
    path.join(rootDir, 'public/Apollo Moon Lander- Astronaut.sog'),
    path.join(rootDir, 'Apollo Moon Lander- Astronaut.sog')
  );
}

console.log('Build completed and deployed to root successfully!');
