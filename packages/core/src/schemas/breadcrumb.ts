import type { BreadcrumbSchema } from '../types.js';

export function buildBreadcrumbSchema(data: BreadcrumbSchema): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
