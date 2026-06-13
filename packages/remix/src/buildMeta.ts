import { buildTags, type MetaTagsConfig } from 'seo-tags';

/**
 * Maps standard framework-agnostic MetaTagsConfig to Remix v2 MetaDescriptor formats.
 * Resolves title templates, Open Graph, PWA, and security headers.
 */
export function buildMeta(config: MetaTagsConfig): any[] {
  const resolved = buildTags(config).resolve();
  const descriptors: any[] = [];

  for (const tag of resolved) {
    if (tag.tag === 'title') {
      descriptors.push({ title: tag.content || '' });
    } else if (tag.tag === 'meta') {
      if (tag.attributes.name) {
        descriptors.push({ name: tag.attributes.name, content: tag.attributes.content || '' });
      } else if (tag.attributes.property) {
        descriptors.push({ property: tag.attributes.property, content: tag.attributes.content || '' });
      } else {
        descriptors.push({ tagName: 'meta', ...tag.attributes });
      }
    } else if (tag.tag === 'link') {
      descriptors.push({ tagName: 'link', ...tag.attributes });
    } else if (tag.tag === 'script') {
      descriptors.push({
        tagName: 'script',
        ...tag.attributes,
        innerHtml: tag.content || ''
      });
    }
  }

  return descriptors;
}
