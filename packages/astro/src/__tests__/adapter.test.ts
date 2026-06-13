import { describe, it, expect } from 'vitest';
import { transform } from '@astrojs/compiler';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Astro Adapter', () => {
  it('should compile MetaTags.astro component successfully', async () => {
    const componentPath = path.resolve(__dirname, '../MetaTags.astro');
    const source = fs.readFileSync(componentPath, 'utf-8');
    const result = await transform(source);

    expect(result.code).toBeDefined();
  });
});
