import { describe, it, expect } from 'vitest';
import { dedupTags } from '../dedup.js';

describe('tag deduplication', () => {
  it('should keep only the last element of matching tag keys', () => {
    const tags: any[] = [
      { tag: 'title', attributes: {}, content: 'First title' },
      { tag: 'title', attributes: {}, content: 'Second title' },
      { tag: 'meta', attributes: { name: 'description', content: 'First desc' } },
      { tag: 'meta', attributes: { name: 'description', content: 'Second desc' } },
    ];
    const deduped = dedupTags(tags);
    expect(deduped).toHaveLength(2);
    expect(deduped[0].content).toBe('Second title');
    expect(deduped[1].attributes.content).toBe('Second desc');
  });
});
