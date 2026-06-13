import type { ArticleSchema } from '../types.js';

export function buildArticleSchema(data: ArticleSchema): Record<string, any> {
  const authorArray = Array.isArray(data.author) ? data.author : [data.author];
  const authors = authorArray.map(a => ({
    '@type': 'Person',
    name: a.name,
    ...(a.url ? { url: a.url } : {})
  }));

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    image: data.image,
    datePublished: data.datePublished,
    author: authors.length === 1 ? authors[0] : authors,
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo
      }
    }
  };

  if (data.description) schema.description = data.description;
  if (data.dateModified) schema.dateModified = data.dateModified;
  if (data.url) schema.url = data.url;

  return schema;
}
