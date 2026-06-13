import { buildArticleSchema } from './article.js';
import { buildProductSchema } from './product.js';
import { buildBreadcrumbSchema } from './breadcrumb.js';
import { buildOrganizationSchema } from './organization.js';
import { buildPersonSchema } from './person.js';
import { buildFAQSchema } from './faq.js';
import { buildEventSchema } from './event.js';
import { buildRecipeSchema } from './recipe.js';
import { buildVideoSchema } from './video.js';
import { buildSoftwareSchema } from './software.js';
import { buildLocalBusinessSchema } from './local-business.js';
import { buildReviewSchema } from './review.js';

/**
 * Compiles a strongly typed data object into a valid context-aware schema.org JSON-LD object.
 */
export function compileTypedSchema(schema: string, data: any): Record<string, any> {
  switch (schema) {
    case 'Article':
      return buildArticleSchema(data);
    case 'Product':
      return buildProductSchema(data);
    case 'Breadcrumb':
      return buildBreadcrumbSchema(data);
    case 'Organization':
      return buildOrganizationSchema(data);
    case 'Person':
      return buildPersonSchema(data);
    case 'FAQ':
      return buildFAQSchema(data);
    case 'Event':
      return buildEventSchema(data);
    case 'Recipe':
      return buildRecipeSchema(data);
    case 'VideoObject':
      return buildVideoSchema(data);
    case 'SoftwareApplication':
      return buildSoftwareSchema(data);
    case 'LocalBusiness':
      return buildLocalBusinessSchema(data);
    case 'Review':
      return buildReviewSchema(data);
    default:
      if (typeof console !== 'undefined') {
        console.error(`[meta-tags] ✗ Unknown schema type "${schema}". Available schema options are: Article, Product, Breadcrumb, Organization, Person, FAQ, Event, Recipe, VideoObject, SoftwareApplication, LocalBusiness, Review.`);
      }
      return {
        '@context': 'https://schema.org',
        '@type': schema,
        ...data
      };
  }
}

export {
  buildArticleSchema,
  buildProductSchema,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildFAQSchema,
  buildEventSchema,
  buildRecipeSchema,
  buildVideoSchema,
  buildSoftwareSchema,
  buildLocalBusinessSchema,
  buildReviewSchema
};
