import { describe, it, expect } from 'vitest';
import { buildTags } from '../builder.js';

describe('MetaTagBuilder', () => {
  it('should compile basic and open graph metadata into correct HTML tags list', () => {
    const builder = buildTags({
      title: 'Post Title',
      titleTemplate: '%s | My Blog',
      description: 'Post Excerpt',
      canonical: 'https://mysite.com/post',
      og: {
        type: 'article',
        image: 'https://mysite.com/cover.jpg'
      }
    });

    const tags = builder.resolve();
    
    expect(tags.find(t => t.tag === 'title')?.content).toBe('Post Title | My Blog');
    expect(tags.find(t => t.tag === 'meta' && t.attributes.name === 'description')?.attributes.content).toBe('Post Excerpt');
    expect(tags.find(t => t.tag === 'link' && t.attributes.rel === 'canonical')?.attributes.href).toBe('https://mysite.com/post');
    expect(tags.find(t => t.tag === 'meta' && t.attributes.property === 'og:type')?.attributes.content).toBe('article');
    expect(tags.find(t => t.tag === 'meta' && t.attributes.property === 'og:image')?.attributes.content).toBe('https://mysite.com/cover.jpg');
    
    expect(tags.find(t => t.tag === 'meta' && t.attributes.name === 'twitter:card')?.attributes.content).toBe('summary_large_image');
  });

  it('should format tags correctly into HTML strings', () => {
    const builder = buildTags({
      title: 'Hello',
      description: 'World'
    });
    const html = builder.toString();
    expect(html).toContain('<title>Hello</title>');
    expect(html).toContain('<meta name="description" content="World" />');
  });
});
