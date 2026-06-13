import type { SoftwareApplicationSchema } from '../types.js';

export function buildSoftwareSchema(data: SoftwareApplicationSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    applicationCategory: data.applicationCategory
  };

  if (data.operatingSystem) schema.operatingSystem = data.operatingSystem;
  if (data.url) schema.url = data.url;
  if (data.description) schema.description = data.description;
  if (data.downloadUrl) schema.downloadUrl = data.downloadUrl;
  if (data.softwareVersion) schema.softwareVersion = data.softwareVersion;

  if (data.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.currency
    };
  }

  return schema;
}
