import type { MetaTagsConfig, RobotsDirective, CSPObject, ResolvedTag } from './types.js';
import { handleEnvironment } from './env.js';
import { deriveTags } from './derive.js';
import { dedupTags } from './dedup.js';
import { validateConfig } from './validator.js';
import { compileTypedSchema } from './schemas/index.js';

/**
 * Helper to serialize RobotsDirective configuration objects or strings.
 */
export function serializeRobots(directive: RobotsDirective | string): string {
  if (typeof directive === 'string') return directive;
  const parts: string[] = [];
  if (directive.index !== undefined) parts.push(directive.index ? 'index' : 'noindex');
  if (directive.follow !== undefined) parts.push(directive.follow ? 'follow' : 'nofollow');
  if (directive.noarchive) parts.push('noarchive');
  if (directive.nosnippet) parts.push('nosnippet');
  if (directive.noimageindex) parts.push('noimageindex');
  if (directive.notranslate) parts.push('notranslate');
  if (directive.nositelinkssearchbox) parts.push('nositelinkssearchbox');
  if (directive.maxSnippet !== undefined) parts.push(`max-snippet:${directive.maxSnippet}`);
  if (directive.maxImagePreview !== undefined) parts.push(`max-image-preview:${directive.maxImagePreview}`);
  if (directive.maxVideoPreview !== undefined) parts.push(`max-video-preview:${directive.maxVideoPreview}`);
  if (directive.unavailableAfter !== undefined) parts.push(`unavailable-after:${directive.unavailableAfter}`);
  return parts.join(', ');
}

/**
 * Helper to serialize CSP configurations into a meta tag compliant string.
 */
export function serializeCSP(csp: string | CSPObject): string {
  if (typeof csp === 'string') return csp;
  const parts: string[] = [];
  const keys = Object.keys(csp);
  for (const key of keys) {
    const val = csp[key];
    if (val === undefined || val === null) continue;
    // Convert camelCase to kebab-case directive name
    const kebab = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    if (typeof val === 'boolean') {
      if (val) parts.push(kebab);
    } else if (Array.isArray(val)) {
      if (val.length > 0) {
        parts.push(`${kebab} ${val.join(' ')}`);
      }
    } else if (typeof val === 'string') {
      parts.push(`${kebab} ${val}`);
    }
  }
  return parts.join('; ') + (parts.length > 0 ? ';' : '');
}

export class MetaTagBuilder {
  private config: MetaTagsConfig;

  constructor(config: MetaTagsConfig) {
    // 1. Check environments (robots override + canonical stripping)
    let processed = handleEnvironment(config);

    // 2. Perform auto-derivations (og:title, twitter:card, etc.)
    processed = deriveTags(processed);

    // 3. Dev-mode SEO audits and rule checks
    validateConfig(processed);

    this.config = processed;
  }

  /**
   * Compiles the config to a unique flat list of final HTML tags.
   */
  public resolve(): ResolvedTag[] {
    const tags: ResolvedTag[] = [];
    const cfg = this.config;

    // ── Charset & Viewport (Rendered first as per SEO standards) ──
    tags.push({
      tag: 'meta',
      attributes: { charset: cfg.charset || 'UTF-8' }
    });

    tags.push({
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: cfg.viewport || 'width=device-width, initial-scale=1'
      }
    });

    // ── Title ──
    if (cfg.title) {
      let titleStr = cfg.title;
      if (cfg.titleTemplate) {
        titleStr = cfg.titleTemplate.replace('%s', cfg.title);
      }
      tags.push({
        tag: 'title',
        attributes: {},
        content: titleStr
      });
    } else if (cfg.titleTemplate) {
      tags.push({
        tag: 'title',
        attributes: {},
        content: cfg.titleTemplate.replace('%s', '')
      });
    }

    // ── Core SEO Meta Tags ──
    if (cfg.description) {
      tags.push({ tag: 'meta', attributes: { name: 'description', content: cfg.description } });
    }
    if (cfg.keywords && cfg.keywords.length > 0) {
      tags.push({ tag: 'meta', attributes: { name: 'keywords', content: cfg.keywords.join(', ') } });
    }
    if (cfg.author) {
      tags.push({ tag: 'meta', attributes: { name: 'author', content: cfg.author } });
    }
    if (cfg.generator) {
      tags.push({ tag: 'meta', attributes: { name: 'generator', content: cfg.generator } });
    }
    if (cfg.themeColor) {
      tags.push({ tag: 'meta', attributes: { name: 'theme-color', content: cfg.themeColor } });
    }
    if (cfg.robots) {
      tags.push({ tag: 'meta', attributes: { name: 'robots', content: serializeRobots(cfg.robots) } });
    }
    if (cfg.googlebot) {
      tags.push({ tag: 'meta', attributes: { name: 'googlebot', content: cfg.googlebot } });
    }

    // ── Canonical URL ──
    if (cfg.canonical) {
      tags.push({ tag: 'link', attributes: { rel: 'canonical', href: cfg.canonical } });
    }

    // ── Open Graph ──
    if (cfg.og) {
      const og = cfg.og;
      if (og.title) tags.push({ tag: 'meta', attributes: { property: 'og:title', content: og.title } });
      if (og.description) tags.push({ tag: 'meta', attributes: { property: 'og:description', content: og.description } });
      if (og.type) tags.push({ tag: 'meta', attributes: { property: 'og:type', content: og.type } });
      if (og.url) tags.push({ tag: 'meta', attributes: { property: 'og:url', content: og.url } });
      if (og.siteName) tags.push({ tag: 'meta', attributes: { property: 'og:site_name', content: og.siteName } });
      if (og.locale) tags.push({ tag: 'meta', attributes: { property: 'og:locale', content: og.locale } });
      if (cfg.alternateLocales) {
        for (const loc of cfg.alternateLocales) {
          tags.push({ tag: 'meta', attributes: { property: 'og:locale:alternate', content: loc } });
        }
      }

      // Images
      if (og.image) {
        const images = Array.isArray(og.image) ? og.image : [og.image];
        for (const img of images) {
          const url = typeof img === 'string' ? img : img.url;
          tags.push({ tag: 'meta', attributes: { property: 'og:image', content: url } });
          tags.push({ tag: 'meta', attributes: { property: 'og:image:secure_url', content: url } });
          if (typeof img === 'object') {
            if (img.type) tags.push({ tag: 'meta', attributes: { property: 'og:image:type', content: img.type } });
            if (img.width !== undefined) tags.push({ tag: 'meta', attributes: { property: 'og:image:width', content: String(img.width) } });
            if (img.height !== undefined) tags.push({ tag: 'meta', attributes: { property: 'og:image:height', content: String(img.height) } });
            if (img.alt) tags.push({ tag: 'meta', attributes: { property: 'og:image:alt', content: img.alt } });
          }
        }
      }
      if (og.imageAlt && typeof og.image === 'string') {
        tags.push({ tag: 'meta', attributes: { property: 'og:image:alt', content: og.imageAlt } });
      }

      // Videos
      if (og.video) {
        const videos = Array.isArray(og.video) ? og.video : [og.video];
        for (const vid of videos) {
          const url = typeof vid === 'string' ? vid : vid.url;
          tags.push({ tag: 'meta', attributes: { property: 'og:video', content: url } });
          tags.push({ tag: 'meta', attributes: { property: 'og:video:secure_url', content: url } });
          if (typeof vid === 'object') {
            if (vid.type) tags.push({ tag: 'meta', attributes: { property: 'og:video:type', content: vid.type } });
            if (vid.width !== undefined) tags.push({ tag: 'meta', attributes: { property: 'og:video:width', content: String(vid.width) } });
            if (vid.height !== undefined) tags.push({ tag: 'meta', attributes: { property: 'og:video:height', content: String(vid.height) } });
          }
        }
      }

      // Audio
      if (og.audio) {
        tags.push({ tag: 'meta', attributes: { property: 'og:audio', content: og.audio } });
      }

      // Article properties
      if (og.publishedTime) tags.push({ tag: 'meta', attributes: { property: 'article:published_time', content: og.publishedTime } });
      if (og.modifiedTime) tags.push({ tag: 'meta', attributes: { property: 'article:modified_time', content: og.modifiedTime } });
      if (og.expirationTime) tags.push({ tag: 'meta', attributes: { property: 'article:expiration_time', content: og.expirationTime } });
      if (og.author) {
        const authors = Array.isArray(og.author) ? og.author : [og.author];
        for (const auth of authors) {
          tags.push({ tag: 'meta', attributes: { property: 'article:author', content: auth } });
        }
      }
      if (og.section) tags.push({ tag: 'meta', attributes: { property: 'article:section', content: og.section } });
      if (og.tag) {
        const ogTags = Array.isArray(og.tag) ? og.tag : [og.tag];
        for (const t of ogTags) {
          tags.push({ tag: 'meta', attributes: { property: 'article:tag', content: t } });
        }
      }

      // Profile properties
      if (og.firstName) tags.push({ tag: 'meta', attributes: { property: 'profile:first_name', content: og.firstName } });
      if (og.lastName) tags.push({ tag: 'meta', attributes: { property: 'profile:last_name', content: og.lastName } });
      if (og.username) tags.push({ tag: 'meta', attributes: { property: 'profile:username', content: og.username } });
      if (og.gender) tags.push({ tag: 'meta', attributes: { property: 'profile:gender', content: og.gender } });

      // Book properties
      if (og.isbn) tags.push({ tag: 'meta', attributes: { property: 'book:isbn', content: og.isbn } });
      if (og.releaseDate) tags.push({ tag: 'meta', attributes: { property: 'book:release_date', content: og.releaseDate } });
    }

    // ── Twitter Card ──
    if (cfg.twitter) {
      const tw = cfg.twitter;
      if (tw.card) tags.push({ tag: 'meta', attributes: { name: 'twitter:card', content: tw.card } });
      if (tw.site) tags.push({ tag: 'meta', attributes: { name: 'twitter:site', content: tw.site } });
      if (tw.creator) tags.push({ tag: 'meta', attributes: { name: 'twitter:creator', content: tw.creator } });
      if (tw.title) tags.push({ tag: 'meta', attributes: { name: 'twitter:title', content: tw.title } });
      if (tw.description) tags.push({ tag: 'meta', attributes: { name: 'twitter:description', content: tw.description } });
      if (tw.image) tags.push({ tag: 'meta', attributes: { name: 'twitter:image', content: tw.image } });
      if (tw.imageAlt) tags.push({ tag: 'meta', attributes: { name: 'twitter:image:alt', content: tw.imageAlt } });

      // App Card
      if (tw.appNameIphone) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:name:iphone', content: tw.appNameIphone } });
      if (tw.appIdIphone) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:id:iphone', content: tw.appIdIphone } });
      if (tw.appUrlIphone) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:url:iphone', content: tw.appUrlIphone } });
      if (tw.appNameIpad) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:name:ipad', content: tw.appNameIpad } });
      if (tw.appIdIpad) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:id:ipad', content: tw.appIdIpad } });
      if (tw.appUrlIpad) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:url:ipad', content: tw.appUrlIpad } });
      if (tw.appNameGoogleplay) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:name:googleplay', content: tw.appNameGoogleplay } });
      if (tw.appIdGoogleplay) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:id:googleplay', content: tw.appIdGoogleplay } });
      if (tw.appUrlGoogleplay) tags.push({ tag: 'meta', attributes: { name: 'twitter:app:url:googleplay', content: tw.appUrlGoogleplay } });

      // Player Card
      if (tw.playerUrl) tags.push({ tag: 'meta', attributes: { name: 'twitter:player', content: tw.playerUrl } });
      if (tw.playerWidth !== undefined) tags.push({ tag: 'meta', attributes: { name: 'twitter:player:width', content: String(tw.playerWidth) } });
      if (tw.playerHeight !== undefined) tags.push({ tag: 'meta', attributes: { name: 'twitter:player:height', content: String(tw.playerHeight) } });
      if (tw.playerStreamContentType) tags.push({ tag: 'meta', attributes: { name: 'twitter:player:stream:content-type', content: tw.playerStreamContentType } });
    }

    // ── hreflang ──
    if (cfg.hreflang) {
      for (const entry of cfg.hreflang) {
        tags.push({ tag: 'link', attributes: { rel: 'alternate', hreflang: entry.lang, href: entry.href } });
      }
    }

    // ── PWA Config ──
    if (cfg.pwa) {
      const pwa = cfg.pwa;
      if (pwa.themeColor) tags.push({ tag: 'meta', attributes: { name: 'theme-color', content: pwa.themeColor } });
      if (pwa.backgroundColor) tags.push({ tag: 'meta', attributes: { name: 'background-color', content: pwa.backgroundColor } });
      if (pwa.manifest) tags.push({ tag: 'link', attributes: { rel: 'manifest', href: pwa.manifest } });
      if (pwa.mobileWebAppCapable) tags.push({ tag: 'meta', attributes: { name: 'mobile-web-app-capable', content: 'yes' } });
      if (pwa.appleWebAppCapable) tags.push({ tag: 'meta', attributes: { name: 'apple-mobile-web-app-capable', content: 'yes' } });
      if (pwa.appleWebAppTitle) tags.push({ tag: 'meta', attributes: { name: 'apple-mobile-web-app-title', content: pwa.appleWebAppTitle } });
      if (pwa.appleStatusBarStyle) tags.push({ tag: 'meta', attributes: { name: 'apple-mobile-web-app-status-bar-style', content: pwa.appleStatusBarStyle } });
      if (pwa.msTileColor) tags.push({ tag: 'meta', attributes: { name: 'msapplication-TileColor', content: pwa.msTileColor } });
      if (pwa.msTileImage) tags.push({ tag: 'meta', attributes: { name: 'msapplication-TileImage', content: pwa.msTileImage } });
      if (pwa.applicationName) tags.push({ tag: 'meta', attributes: { name: 'application-name', content: pwa.applicationName } });
      if (pwa.appleIcon) {
        const icons = Array.isArray(pwa.appleIcon) ? pwa.appleIcon : [{ href: pwa.appleIcon }];
        for (const icon of icons) {
          const attr: Record<string, string> = { rel: 'apple-touch-icon', href: icon.href };
          if (icon.sizes) attr.sizes = icon.sizes;
          tags.push({ tag: 'link', attributes: attr });
        }
      }
    }

    // ── Security Headers ──
    if (cfg.security) {
      const sec = cfg.security;
      if (sec.contentSecurityPolicy) {
        tags.push({
          tag: 'meta',
          attributes: { 'http-equiv': 'Content-Security-Policy', content: serializeCSP(sec.contentSecurityPolicy) }
        });
      }
      if (sec.xFrameOptions) {
        tags.push({ tag: 'meta', attributes: { 'http-equiv': 'X-Frame-Options', content: sec.xFrameOptions } });
      }
      if (sec.xContentTypeOptions) {
        tags.push({ tag: 'meta', attributes: { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' } });
      }
      if (sec.referrerPolicy) {
        tags.push({ tag: 'meta', attributes: { name: 'referrer', content: sec.referrerPolicy } });
      }
      if (sec.permissionsPolicy) {
        tags.push({ tag: 'meta', attributes: { name: 'permissions-policy', content: sec.permissionsPolicy } });
      }
    }

    // ── Performance Resource Hints ──
    if (cfg.hints) {
      for (const hint of cfg.hints) {
        const attr: Record<string, string> = { rel: hint.rel, href: hint.href };
        if (hint.as) attr.as = hint.as;
        if (hint.type) attr.type = hint.type;
        if (hint.crossOrigin) attr.crossorigin = hint.crossOrigin;
        if (hint.media) attr.media = hint.media;
        if (hint.imageSrcset) attr.imagesrcset = hint.imageSrcset;
        if (hint.imageSizes) attr.imagesizes = hint.imageSizes;
        tags.push({ tag: 'link', attributes: attr });
      }
    }

    // ── Extra Tags (custom escape hatch) ──
    if (cfg.extra) {
      for (const custom of cfg.extra) {
        tags.push({ tag: custom.tag, attributes: custom.attributes });
      }
    }

    // ── JSON-LD Structured Data Schemas ──
    if (cfg.jsonLd) {
      const schemas = Array.isArray(cfg.jsonLd) ? cfg.jsonLd : [cfg.jsonLd];
      for (const schemaInput of schemas) {
        let serializedSchema: Record<string, any>;
        if ('raw' in schemaInput) {
          serializedSchema = schemaInput.raw;
        } else {
          serializedSchema = compileTypedSchema(schemaInput.schema, schemaInput.data);
        }
        tags.push({
          tag: 'script',
          attributes: { type: 'application/ld+json' },
          content: JSON.stringify(serializedSchema)
        });
      }
    }

    // Deduplicate from right to left (deepest layer overriding previous defaults)
    return dedupTags(tags);
  }

  /**
   * Serializes the tags into an HTML string (ideal for SSR).
   */
  public toString(): string {
    const resolved = this.resolve();
    return resolved.map(tag => {
      const attrsStr = Object.entries(tag.attributes)
        .map(([k, v]) => `${k}="${(v as string).replace(/"/g, '&quot;')}"`)
        .join(' ');
      const space = attrsStr ? ' ' : '';
      if (tag.tag === 'title') {
        return `<title${space}${attrsStr}>${tag.content || ''}</title>`;
      }
      if (tag.tag === 'script') {
        return `<script${space}${attrsStr}>${tag.content || ''}</script>`;
      }
      return `<${tag.tag}${space}${attrsStr} />`;
    }).join('\n');
  }

  /**
   * Injects the tags into a DOM head element (ideal for SPA router client-side navigation).
   */
  public inject(head: HTMLElement): void {
    if (!head || typeof document === 'undefined') return;
    const resolved = this.resolve();
    
    // Clean out previous tags injected by this builder
    const previous = head.querySelectorAll('[data-meta-tags]');
    previous.forEach(el => el.remove());

    resolved.forEach(tag => {
      const el = document.createElement(tag.tag);
      el.setAttribute('data-meta-tags', 'true');
      Object.entries(tag.attributes).forEach(([k, v]) => {
        el.setAttribute(k, v);
      });
      if (tag.content) {
        el.textContent = tag.content;
      }
      head.appendChild(el);
    });
  }
}

/**
 * Functional convenience helper to build tags immediately.
 */
export function buildTags(config: MetaTagsConfig): MetaTagBuilder {
  return new MetaTagBuilder(config);
}

/**
 * Configuration helper that returns the config object with TypeScript typings enforced.
 */
export function defineConfig(config: MetaTagsConfig): MetaTagsConfig {
  return config;
}
