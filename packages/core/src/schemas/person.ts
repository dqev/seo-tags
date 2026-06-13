import type { PersonSchema } from '../types.js';

export function buildPersonSchema(data: PersonSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name
  };

  if (data.url) schema.url = data.url;
  if (data.image) schema.image = data.image;
  if (data.jobTitle) schema.jobTitle = data.jobTitle;
  if (data.sameAs) schema.sameAs = data.sameAs;
  if (data.knowsAbout) schema.knowsAbout = data.knowsAbout;
  if (data.worksFor) {
    schema.worksFor = {
      '@type': 'Organization',
      name: data.worksFor.name,
      ...(data.worksFor.url ? { url: data.worksFor.url } : {})
    };
  }

  return schema;
}
