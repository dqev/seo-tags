import { describe, it, expect } from 'vitest';
import { buildMeta } from '../buildMeta.js';

describe('Remix Adapter', () => {
  describe('buildMeta', () => {
    it('should compile title tags correctly', () => {
      const descriptors = buildMeta({
        title: 'Home Page',
        titleTemplate: '%s | My Site'
      });

      expect(descriptors).toContainEqual({ title: 'Home Page | My Site' });
    });

    it('should map meta name and property tags correctly', () => {
      const descriptors = buildMeta({
        description: 'About us',
        og: {
          title: 'OG Title',
          description: 'OG Desc'
        }
      });

      expect(descriptors).toContainEqual({ name: 'description', content: 'About us' });
      expect(descriptors).toContainEqual({ property: 'og:title', content: 'OG Title' });
      expect(descriptors).toContainEqual({ property: 'og:description', content: 'OG Desc' });
    });

    it('should map canonical and hreflang links correctly', () => {
      const descriptors = buildMeta({
        canonical: 'https://example.com/page',
        hreflang: [
          { lang: 'en', href: 'https://example.com/en' }
        ]
      });

      expect(descriptors).toContainEqual({
        tagName: 'link',
        rel: 'canonical',
        href: 'https://example.com/page'
      });
      expect(descriptors).toContainEqual({
        tagName: 'link',
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://example.com/en'
      });
    });

    it('should compile JSON-LD scripts correctly', () => {
      const descriptors = buildMeta({
        jsonLd: {
          raw: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Home'
          }
        }
      });

      expect(descriptors).toContainEqual({
        tagName: 'script',
        type: 'application/ld+json',
        innerHtml: '{"@context":"https://schema.org","@type":"WebPage","name":"Home"}'
      });
    });
  });
});
