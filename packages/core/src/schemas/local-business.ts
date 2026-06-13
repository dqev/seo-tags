import type { LocalBusinessSchema } from '../types.js';

export function buildLocalBusinessSchema(data: LocalBusinessSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    image: data.image,
    url: data.url,
    telephone: data.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.street,
      addressLocality: data.address.city,
      addressRegion: data.address.state,
      postalCode: data.address.postalCode,
      addressCountry: data.address.country
    }
  };

  if (data.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.lat,
      longitude: data.geo.lng
    };
  }

  if (data.openingHours) {
    schema.openingHours = data.openingHours;
  }

  if (data.priceRange) {
    schema.priceRange = data.priceRange;
  }

  return schema;
}
