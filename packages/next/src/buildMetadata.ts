import { handleEnvironment, deriveTags, validateConfig } from 'seo-tags';
import type { MetaTagsConfig } from 'seo-tags';

/**
 * Maps standard framework-agnostic MetaTagsConfig to a Next.js App Router metadata structure.
 * Resolves Open Graph, Twitter cards, PWA settings, sitemap targets, and crawler definitions.
 */
export function buildMetadata(config: MetaTagsConfig): any {
  // 1. Process environment overrides and canonical stripping
  const processed = handleEnvironment(config);

  // 2. Auto-derive properties (e.g. og:title from title, etc.)
  const cfg = deriveTags(processed);

  // 3. Run SEO validation in dev mode
  validateConfig(cfg);

  const metadata: any = {};

  // Title configurations mapping
  if (cfg.title) {
    if (cfg.titleTemplate) {
      metadata.title = {
        default: cfg.title,
        template: cfg.titleTemplate
      };
    } else {
      metadata.title = cfg.title;
    }
  } else if (cfg.titleTemplate) {
    metadata.title = {
      default: '',
      template: cfg.titleTemplate
    };
  }

  if (cfg.description) metadata.description = cfg.description;
  if (cfg.keywords) metadata.keywords = cfg.keywords;
  if (cfg.author) metadata.authors = [{ name: cfg.author }];
  if (cfg.generator) metadata.generator = cfg.generator;
  if (cfg.themeColor) metadata.themeColor = cfg.themeColor;

  if (cfg.baseUrl) {
    try {
      metadata.metadataBase = new URL(cfg.baseUrl);
    } catch {
      // Ignored for invalid baseUrl strings
    }
  }

  // Alternates (canonical link and hreflang translations)
  const alternates: any = {};
  if (cfg.canonical) alternates.canonical = cfg.canonical;
  if (cfg.hreflang && cfg.hreflang.length > 0) {
    const languages: Record<string, string> = {};
    for (const entry of cfg.hreflang) {
      languages[entry.lang] = entry.href;
    }
    alternates.languages = languages;
  }
  if (Object.keys(alternates).length > 0) {
    metadata.alternates = alternates;
  }

  // Robots definitions
  if (cfg.robots) {
    if (typeof cfg.robots === 'string') {
      metadata.robots = cfg.robots;
    } else {
      const r = cfg.robots;
      metadata.robots = {
        index: r.index,
        follow: r.follow,
        nocache: r.noarchive,
        googleBot: cfg.googlebot ? cfg.googlebot : undefined
      };
    }
  }

  // Open Graph parameters
  if (cfg.og) {
    const og = cfg.og;
    const openGraph: any = {};
    if (og.title) openGraph.title = og.title;
    if (og.description) openGraph.description = og.description;
    if (og.type) openGraph.type = og.type;
    if (og.url) openGraph.url = og.url;
    if (og.siteName) openGraph.siteName = og.siteName;
    if (og.locale) openGraph.locale = og.locale;

    if (og.image) {
      const imagesList = Array.isArray(og.image) ? og.image : [og.image];
      openGraph.images = imagesList.map(img => {
        if (typeof img === 'string') {
          return { url: img, alt: og.imageAlt };
        }
        return {
          url: img.url,
          secureUrl: img.secureUrl,
          type: img.type,
          width: img.width,
          height: img.height,
          alt: img.alt
        };
      });
    }

    if (og.type === 'article') {
      const article: any = {};
      if (og.publishedTime) article.publishedTime = og.publishedTime;
      if (og.modifiedTime) article.modifiedTime = og.modifiedTime;
      if (og.expirationTime) article.expirationTime = og.expirationTime;
      if (og.author) article.authors = Array.isArray(og.author) ? og.author : [og.author];
      if (og.section) article.section = og.section;
      if (og.tag) article.tags = Array.isArray(og.tag) ? og.tag : [og.tag];
      openGraph.article = article;
    }

    metadata.openGraph = openGraph;
  }

  // Twitter cards mapping
  if (cfg.twitter) {
    const tw = cfg.twitter;
    const twitter: any = {};
    if (tw.card) twitter.card = tw.card;
    if (tw.site) twitter.site = tw.site;
    if (tw.creator) twitter.creator = tw.creator;
    if (tw.title) twitter.title = tw.title;
    if (tw.description) twitter.description = tw.description;
    if (tw.image) twitter.images = [{ url: tw.image, alt: tw.imageAlt }];
    metadata.twitter = twitter;
  }

  // PWA elements: icons, manifest
  if (cfg.pwa) {
    const pwa = cfg.pwa;
    if (pwa.manifest) metadata.manifest = pwa.manifest;
    if (pwa.appleIcon) {
      const icons = Array.isArray(pwa.appleIcon) ? pwa.appleIcon : [pwa.appleIcon];
      metadata.icons = {
        apple: icons.map(icon => {
          if (typeof icon === 'string') return { url: icon };
          return { url: icon.href, sizes: icon.sizes };
        })
      };
    }
  }

  return metadata;
}
