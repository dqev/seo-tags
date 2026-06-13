import type { ProductSchema } from '../types.js';

export function buildProductSchema(data: ProductSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    image: data.image,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency
    }
  };

  if (data.description) schema.description = data.description;
  if (data.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand
    };
  }
  if (data.sku) schema.sku = data.sku;
  if (data.url) schema.offers.url = data.url;

  if (data.availability) {
    let availabilityUrl = 'https://schema.org/InStock';
    if (data.availability === 'OutOfStock') availabilityUrl = 'https://schema.org/OutOfStock';
    if (data.availability === 'PreOrder') availabilityUrl = 'https://schema.org/PreOrder';
    schema.offers.availability = availabilityUrl;
  }

  if (data.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value,
      reviewCount: data.rating.count
    };
  }

  return schema;
}
