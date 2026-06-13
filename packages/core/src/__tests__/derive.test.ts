import { describe, it, expect } from 'vitest';
import { deriveTags } from '../derive.js';

describe('auto tag derivation', () => {
  it('should derive OG tags from standard title and description', () => {
    const config = {
      title: 'Hello',
      description: 'World description',
      canonical: 'https://mysite.com'
    };
    const derived = deriveTags(config);
    expect(derived.og?.title).toBe('Hello');
    expect(derived.og?.description).toBe('World description');
    expect(derived.og?.url).toBe('https://mysite.com');
  });

  it('should derive twitter tags from OG tags', () => {
    const config = {
      title: 'Hello',
      description: 'World description',
      og: {
        image: 'https://mysite.com/img.jpg'
      }
    };
    const derived = deriveTags(config);
    expect(derived.twitter?.title).toBe('Hello');
    expect(derived.twitter?.description).toBe('World description');
    expect(derived.twitter?.image).toBe('https://mysite.com/img.jpg');
    expect(derived.twitter?.card).toBe('summary_large_image');
  });
});
