import type { OrganizationSchema } from '../types.js';

export function buildOrganizationSchema(data: OrganizationSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo
  };

  if (data.description) schema.description = data.description;
  if (data.foundingDate) schema.foundingDate = data.foundingDate;
  if (data.sameAs) schema.sameAs = data.sameAs;
  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      contactOption: data.contactPoint.type
    };
  }

  return schema;
}
