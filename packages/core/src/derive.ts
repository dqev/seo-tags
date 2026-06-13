import type { MetaTagsConfig } from './types.js';

/**
 * Derives Open Graph and Twitter Card configurations from base config settings.
 * If properties (title, description, canonical, siteName, locale) are set, they
 * automatically populate their corresponding Open Graph tags.
 * Similarly, Twitter Card values are derived from Open Graph values.
 */
export function deriveTags(config: MetaTagsConfig): MetaTagsConfig {
  const derived = { ...config };

  // Create clean copies of nested og and twitter configs to prevent mutating source parameters
  derived.og = { ...config.og };
  derived.twitter = { ...config.twitter };

  const baseUrl = config.baseUrl;

  // Helper to make URLs absolute using baseUrl if needed
  const resolveUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (baseUrl) {
      try {
        const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const relative = url.startsWith('/') ? url.slice(1) : url;
        return new URL(relative, base).toString();
      } catch {
        return url;
      }
    }
    return url;
  };

  // 1. og:title <- title
  if (config.title && !derived.og.title) {
    derived.og.title = config.title;
  }

  // 2. og:description <- description
  if (config.description && !derived.og.description) {
    derived.og.description = config.description;
  }

  // 3. og:url <- canonical (or resolved)
  let derivedUrl = config.canonical;
  if (derivedUrl) {
    derivedUrl = resolveUrl(derivedUrl);
    if (!derived.og.url) {
      derived.og.url = derivedUrl;
    }
  }

  // 4. og:site_name <- siteName
  if (config.siteName && !derived.og.siteName) {
    derived.og.siteName = config.siteName;
  }

  // 5. og:locale <- locale
  if (config.locale && !derived.og.locale) {
    derived.og.locale = config.locale;
  }

  // 6. Resolve og:image URL
  let ogImageUrl: string | undefined;
  if (derived.og.image) {
    if (typeof derived.og.image === 'string') {
      ogImageUrl = resolveUrl(derived.og.image);
    } else if (Array.isArray(derived.og.image)) {
      const firstImg = derived.og.image[0];
      if (firstImg) {
        ogImageUrl = typeof firstImg === 'string' ? resolveUrl(firstImg) : resolveUrl(firstImg.url);
      }
    } else {
      ogImageUrl = resolveUrl(derived.og.image.url);
    }
  }

  // If a single imageAlt shorthand is provided and the image is a string,
  // align it into the og image configurations structure during derivation.
  if (derived.og.imageAlt && typeof derived.og.image === 'string') {
    derived.og.image = {
      url: resolveUrl(derived.og.image) || derived.og.image,
      alt: derived.og.imageAlt
    };
  }

  // 7. twitter:title <- og:title
  if (derived.og.title && !derived.twitter.title) {
    derived.twitter.title = derived.og.title;
  }

  // 8. twitter:description <- og:description
  if (derived.og.description && !derived.twitter.description) {
    derived.twitter.description = derived.og.description;
  }

  // 9. twitter:image <- og:image
  if (ogImageUrl && !derived.twitter.image) {
    derived.twitter.image = ogImageUrl;
  }

  // 10. twitter:card <- "summary_large_image" if image exists, else "summary"
  if (!derived.twitter.card) {
    derived.twitter.card = ogImageUrl ? 'summary_large_image' : 'summary';
  }

  return derived;
}
