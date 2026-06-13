import { describe, it, expect } from 'vitest';
import { mergeConfigs } from '../cascade.js';

describe('cascade overrides', () => {
  it('should override scalar fields (last writer wins)', () => {
    const merged = mergeConfigs([
      { title: 'Default Title', description: 'Default Desc' },
      { title: 'Page Title' }
    ]);
    expect(merged.title).toBe('Page Title');
    expect(merged.description).toBe('Default Desc');
  });

  it('should deep merge object fields', () => {
    const merged = mergeConfigs([
      { og: { type: 'website', title: 'Default OG' } },
      { og: { title: 'Overridden OG', description: 'Post Desc' } }
    ]);
    expect(merged.og?.type).toBe('website');
    expect(merged.og?.title).toBe('Overridden OG');
    expect(merged.og?.description).toBe('Post Desc');
  });

  it('should union array fields', () => {
    const merged = mergeConfigs([
      { keywords: ['seo', 'meta'] },
      { keywords: ['react', 'seo'] }
    ]);
    expect(merged.keywords).toEqual(['seo', 'meta', 'react']);
  });

  it('should stack JSON-LD elements', () => {
    const merged = mergeConfigs([
      { jsonLd: { schema: 'Person', data: { name: 'Alice' } } as any },
      { jsonLd: { schema: 'Article', data: { headline: 'Hello' } } as any }
    ]);
    expect(Array.isArray(merged.jsonLd)).toBe(true);
    expect(merged.jsonLd).toHaveLength(2);
  });
});
