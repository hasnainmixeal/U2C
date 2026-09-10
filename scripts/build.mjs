import { copyFile, readdir, rm, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = process.cwd();

console.log('1. Converting SOG to native splat binary buffer if needed...');
if (!fs.existsSync(path.join(rootDir, 'astronaut-splat.bin')) || !fs.existsSync(path.join(rootDir, 'public/astronaut-splat.bin'))) {
  execSync('node scripts/convert-sog-to-splat.mjs', { stdio: 'inherit' });
} else {
  console.log('astronaut-splat.bin already present.');
}

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

// Ensure astronaut-splat.bin exists at root and in public
if (fs.existsSync(path.join(rootDir, 'public/astronaut-splat.bin'))) {
  await copyFile(
    path.join(rootDir, 'public/astronaut-splat.bin'),
    path.join(rootDir, 'astronaut-splat.bin')
  );
}

// Ensure SOG models exist at root for backwards compatibility
if (fs.existsSync(path.join(rootDir, 'public/apollo-moon-lander-astronaut.sog'))) {
  await copyFile(
    path.join(rootDir, 'public/apollo-moon-lander-astronaut.sog'),
    path.join(rootDir, 'apollo-moon-lander-astronaut.sog')
  );
}

// Clean up legacy hero-viewer directories if present
if (fs.existsSync(path.join(rootDir, 'hero-viewer'))) {
  fs.rmSync(path.join(rootDir, 'hero-viewer'), { recursive: true, force: true });
}
if (fs.existsSync(path.join(rootDir, 'public/hero-viewer'))) {
  fs.rmSync(path.join(rootDir, 'public/hero-viewer'), { recursive: true, force: true });
}

console.log('Build completed and deployed to root successfully!');
