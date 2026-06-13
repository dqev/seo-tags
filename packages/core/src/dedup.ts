import type { ResolvedTag } from './types.js';

/**
 * Generates a unique identity key for a resolved tag element.
 * These keys are used to filter out duplicate tags, ensuring that
 * tags closer to the page overwrite site-wide defaults.
 */
export function getTagKey(tag: ResolvedTag, jsonLdCounter: { count: number }): string {
  const { tag: tagName, attributes } = tag;

  if (tagName === 'title') {
    return 'title';
  }

  if (tagName === 'meta') {
    if (attributes.name) {
      return `meta:name:${attributes.name.toLowerCase()}`;
    }
    if (attributes.property) {
      return `meta:property:${attributes.property.toLowerCase()}`;
    }
    if (attributes['http-equiv']) {
      return `meta:http-equiv:${attributes['http-equiv'].toLowerCase()}`;
    }
    if (attributes.charset) {
      return 'meta:charset';
    }
  }

  if (tagName === 'link') {
    const rel = attributes.rel?.toLowerCase() || '';
    if (rel === 'canonical') {
      return 'link:canonical';
    }
    if (rel === 'alternate') {
      if (attributes.hreflang) {
        return `link:alternate:hreflang:${attributes.hreflang.toLowerCase()}`;
      }
      return `link:alternate:${attributes.href || ''}`;
    }
    if (rel === 'manifest') {
      return 'link:manifest';
    }
    if (rel === 'apple-touch-icon') {
      return `link:apple-touch-icon:${attributes.sizes || 'default'}`;
    }
    if (['preload', 'prefetch', 'preconnect', 'dns-prefetch', 'prerender', 'modulepreload'].includes(rel)) {
      return `link:${rel}:${attributes.href || ''}`;
    }
  }

  if (tagName === 'script') {
    if (attributes.type === 'application/ld+json') {
      return `jsonld:${jsonLdCounter.count++}`;
    }
  }

  // Fallback for custom or unique tags
  return `${tagName}:${JSON.stringify(attributes)}`;
}

/**
 * Deduplicates an array of resolved tags, resolving conflicts using the "last writer wins" strategy.
 * Returns a new list containing only the final overridden tags.
 */
export function dedupTags(tags: ResolvedTag[]): ResolvedTag[] {
  const seenKeys = new Set<string>();
  const result: ResolvedTag[] = [];
  const jsonLdCounter = { count: 0 };

  // Traverse in reverse order so that elements further down the array override earlier ones
  for (let i = tags.length - 1; i >= 0; i--) {
    const tag = tags[i];
    const key = getTagKey(tag, jsonLdCounter);

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.unshift(tag);
    }
  }

  return result;
}
