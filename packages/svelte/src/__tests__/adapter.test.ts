import { describe, it, expect } from 'vitest';
import { compile } from 'svelte/compiler';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Svelte Adapter', () => {
  it('should compile MetaTags.svelte component successfully', () => {
    const componentPath = path.resolve(__dirname, '../MetaTags.svelte');
    const source = fs.readFileSync(componentPath, 'utf-8');
    const result = compile(source);

    expect(result.js.code).toBeDefined();
    expect(result.warnings).toEqual([]);
  });
});
