declare const process: any;

export interface SitemapRoute {
  path: string;
  lastModified?: string | Date;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: Array<{ lang: string; href: string }>;
}

export interface SitemapConfig {
  baseUrl: string;
  routes: SitemapRoute[];
  images?: Array<{ loc: string; caption?: string; title?: string }>;
}

export interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  baseUrl: string;
  rules: RobotsRule[];
  sitemap?: string | string[];
  host?: string;
  env?: {
    noindexOn: string[];
    currentEnv?: string;
  };
}

/**
 * Builds a sitemap list structure compatible with Next.js MetadataRoute.Sitemap.
 * Exposes a non-enumerable .toXML() helper to serialize to standard sitemap XML string.
 */
export function buildSitemap(config: SitemapConfig): any[] & { toXML(): string } {
  const resolved = config.routes.map(route => {
    const url = route.path.startsWith('http')
      ? route.path
      : new URL(route.path.startsWith('/') ? route.path.slice(1) : route.path, config.baseUrl).toString();

    const alternatesLanguages: Record<string, string> = {};
    if (route.alternates) {
      for (const alt of route.alternates) {
        alternatesLanguages[alt.lang] = alt.href;
      }
    }

    return {
      url,
      lastModified: route.lastModified,
      changeFrequency: route.changeFreq,
      priority: route.priority,
      ...(route.alternates ? { alternates: { languages: alternatesLanguages } } : {})
    };
  });

  Object.defineProperty(resolved, 'toXML', {
    value: function () {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
      
      const hasAlternates = config.routes.some(r => r.alternates && r.alternates.length > 0);
      if (hasAlternates) {
        xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
      }
      xml += '>\n';

      for (const r of config.routes) {
        const url = r.path.startsWith('http')
          ? r.path
          : new URL(r.path.startsWith('/') ? r.path.slice(1) : r.path, config.baseUrl).toString();

        xml += '  <url>\n';
        xml += `    <loc>${url}</loc>\n`;
        if (r.lastModified) {
          const date = r.lastModified instanceof Date ? r.lastModified.toISOString() : r.lastModified;
          xml += `    <lastmod>${date}</lastmod>\n`;
        }
        if (r.changeFreq) {
          xml += `    <changefreq>${r.changeFreq}</changefreq>\n`;
        }
        if (r.priority !== undefined) {
          xml += `    <priority>${r.priority.toFixed(1)}</priority>\n`;
        }
        if (r.alternates) {
          for (const alt of r.alternates) {
            xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />\n`;
          }
        }
        xml += '  </url>\n';
      }

      xml += '</urlset>';
      return xml;
    },
    enumerable: false
  });

  return resolved as any;
}

/**
 * Builds a robots rule structure compatible with Next.js MetadataRoute.Robots.
 * If the environment matches the noindexOn configurations, it returns a restrictive noindex.
 * Exposes a non-enumerable .toText() helper to serialize to robots.txt format.
 */
export function buildRobots(config: RobotsConfig): any & { toText(): string } {
  let isNoindex = false;

  // Environment guard check
  if (config.env) {
    const { noindexOn = [], currentEnv: configEnv } = config.env;
    let currentEnv = configEnv;
    if (!currentEnv) {
      try {
        if (typeof process !== 'undefined' && process.env) {
          currentEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || process.env.ENV;
        }
      } catch {
        // Safe skip
      }
    }
    if (currentEnv && noindexOn.includes(currentEnv)) {
      isNoindex = true;
    }
  }

  const finalRules = isNoindex
    ? [
        {
          userAgent: '*',
          disallow: '/'
        }
      ]
    : config.rules;

  const resolved = {
    rules: finalRules,
    sitemap: isNoindex ? undefined : config.sitemap,
    host: config.host
  };

  Object.defineProperty(resolved, 'toText', {
    value: function () {
      let txt = '';
      const rulesList = Array.isArray(resolved.rules) ? resolved.rules : [resolved.rules];
      for (const rule of rulesList) {
        const agents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
        for (const agent of agents) {
          txt += `User-agent: ${agent}\n`;
        }
        if (rule.allow) {
          const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
          for (const allow of allows) {
            txt += `Allow: ${allow}\n`;
          }
        }
        if (rule.disallow) {
          const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
          for (const disallow of disallows) {
            txt += `Disallow: ${disallow}\n`;
          }
        }
        if (rule.crawlDelay) {
          txt += `Crawl-delay: ${rule.crawlDelay}\n`;
        }
        txt += '\n';
      }
      if (resolved.sitemap) {
        const sitemaps = Array.isArray(resolved.sitemap) ? resolved.sitemap : [resolved.sitemap];
        for (const sitemap of sitemaps) {
          txt += `Sitemap: ${sitemap}\n`;
        }
      }
      if (resolved.host) {
        txt += `Host: ${resolved.host}\n`;
      }
      return txt.trim() + '\n';
    },
    enumerable: false
  });

  return resolved as any;
}
