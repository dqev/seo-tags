import React from 'react';
import { describe, it, expect } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import { buildMetadata } from '../buildMetadata.js';
import { JsonLd } from '../JsonLd.js';

describe('Next.js Adapter', () => {
  describe('buildMetadata', () => {
    it('should correctly format basic title and titleTemplate', () => {
      const metadata = buildMetadata({
        title: 'My Page',
        titleTemplate: '%s | My Site',
        description: 'About this page',
        keywords: ['tag1', 'tag2'],
        author: 'Alice'
      });

      expect(metadata.title).toEqual({
        default: 'My Page',
        template: '%s | My Site'
      });
      expect(metadata.description).toBe('About this page');
      expect(metadata.keywords).toEqual(['tag1', 'tag2']);
      expect(metadata.authors).toEqual([{ name: 'Alice' }]);
    });

    it('should correctly map canonical URLs and alternates', () => {
      const metadata = buildMetadata({
        canonical: 'https://example.com/canonical',
        hreflang: [
          { lang: 'en', href: 'https://example.com/en' },
          { lang: 'fr', href: 'https://example.com/fr' }
        ]
      });

      expect(metadata.alternates.canonical).toBe('https://example.com/canonical');
      expect(metadata.alternates.languages).toEqual({
        en: 'https://example.com/en',
        fr: 'https://example.com/fr'
      });
    });

    it('should map Open Graph config correctly', () => {
      const metadata = buildMetadata({
        og: {
          title: 'OG Title',
          description: 'OG Desc',
          type: 'article',
          image: {
            url: 'https://example.com/image.jpg',
            width: 1200,
            height: 630,
            alt: 'OG Alt'
          },
          publishedTime: '2026-06-13T00:00:00Z',
          author: ['Author 1']
        }
      });

      expect(metadata.openGraph.title).toBe('OG Title');
      expect(metadata.openGraph.description).toBe('OG Desc');
      expect(metadata.openGraph.type).toBe('article');
      expect(metadata.openGraph.images).toEqual([
        {
          url: 'https://example.com/image.jpg',
          secureUrl: undefined,
          type: undefined,
          width: 1200,
          height: 630,
          alt: 'OG Alt'
        }
      ]);
      expect(metadata.openGraph.article).toEqual({
        publishedTime: '2026-06-13T00:00:00Z',
        modifiedTime: undefined,
        expirationTime: undefined,
        authors: ['Author 1'],
        section: undefined,
        tags: undefined
      });
    });
  });

  describe('JsonLd RSC', () => {
    it('should render correct script block when using raw property', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <JsonLd raw={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Home' }} />
      );

      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain('"@type":"WebPage"');
      expect(html).toContain('"name":"Home"');
    });

    it('should compile typed schema and render script', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        <JsonLd schema="Person" data={{ name: 'Alice' }} />
      );

      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain('"@type":"Person"');
      expect(html).toContain('"name":"Alice"');
    });
  });
});
