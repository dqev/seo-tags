import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coreDist = path.resolve(__dirname, '../dist');
const projectRoot = path.resolve(__dirname, '../../..');

// Helper to copy files recursively
function copyDir(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Warning: Source not found: ${src}`);
  }
}

// Copy adapters to core dist folder
copyDir(path.resolve(projectRoot, 'packages/react/dist'), path.resolve(coreDist, 'react'));
copyDir(path.resolve(projectRoot, 'packages/next/dist'), path.resolve(coreDist, 'next'));
copyDir(path.resolve(projectRoot, 'packages/remix/dist'), path.resolve(coreDist, 'remix'));
copyDir(path.resolve(projectRoot, 'packages/og/dist'), path.resolve(coreDist, 'og'));
copyDir(path.resolve(projectRoot, 'packages/cli/dist'), path.resolve(coreDist, 'cli'));

// Copy astro and svelte files directly
try {
  fs.mkdirSync(path.resolve(coreDist, 'astro'), { recursive: true });
  fs.copyFileSync(
    path.resolve(projectRoot, 'packages/astro/src/MetaTags.astro'),
    path.resolve(coreDist, 'astro/MetaTags.astro')
  );
  console.log('Copied Astro component to dist/astro/MetaTags.astro');
} catch (err) {
  console.error('Error copying Astro component:', err.message);
}

try {
  fs.mkdirSync(path.resolve(coreDist, 'svelte'), { recursive: true });
  fs.copyFileSync(
    path.resolve(projectRoot, 'packages/svelte/src/MetaTags.svelte'),
    path.resolve(coreDist, 'svelte/MetaTags.svelte')
  );
  console.log('Copied Svelte component to dist/svelte/MetaTags.svelte');
} catch (err) {
  console.error('Error copying Svelte component:', err.message);
}

// Copy LICENSE from root to packages/core/LICENSE
try {
  fs.copyFileSync(
    path.resolve(projectRoot, 'LICENSE'),
    path.resolve(__dirname, '../LICENSE')
  );
  console.log('Copied LICENSE to packages/core/LICENSE');
} catch (err) {
  console.error('Error copying LICENSE:', err.message);
}

