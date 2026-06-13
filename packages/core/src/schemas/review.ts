import type { ReviewSchema } from '../types.js';

export function buildReviewSchema(data: ReviewSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Thing',
      name: data.itemName
    },
    reviewBody: data.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.ratingValue
    },
    author: {
      '@type': 'Person',
      name: data.reviewerName
    }
  };

  if (data.datePublished) {
    schema.datePublished = data.datePublished;
  }

  return schema;
}
