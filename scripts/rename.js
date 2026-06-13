import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const targets = [
  'packages/react/src/HeadManager.ts',
  'packages/react/src/MetaTagsProvider.tsx',
  'packages/react/src/useMetaTags.ts',
  'packages/react/src/JsonLd.tsx',
  'packages/react/src/MetaTags.tsx',
  'packages/next/src/JsonLd.tsx',
  'packages/next/src/buildMetadata.ts',
  'packages/remix/src/buildMeta.ts',
  'packages/astro/src/MetaTags.astro',
  'packages/svelte/src/MetaTags.svelte',
  'packages/cli/src/commands/validate.ts',
  'packages/cli/src/commands/init.ts',
  'apps/playground/src/App.tsx',
  'apps/sandbox/index.ts'
];

for (const relPath of targets) {
  const absPath = path.resolve(root, relPath);
  if (fs.existsSync(absPath)) {
    let content = fs.readFileSync(absPath, 'utf8');
    // Replace 'meta-tags' imports
    content = content.replace(/from\s+['"]meta-tags['"]/g, "from 'seo-tags'");
    content = content.replace(/from\s+['"]meta-tags\/([^'"]+)['"]/g, "from 'seo-tags/$1'");
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`Updated imports in ${relPath}`);
  } else {
    console.warn(`File not found: ${relPath}`);
  }
}
