import type { MetaTagsConfig } from './types.js';

/**
 * Deep merges multiple levels of configuration, applying the tag cascade.
 * Override order (lowest to highest priority):
 * defaults -> layout -> page -> component
 */
export function mergeConfigs(configs: MetaTagsConfig[]): MetaTagsConfig {
  const result: MetaTagsConfig = {};

  for (const config of configs) {
    if (!config) continue;

    // Merge scalar fields (last writer wins)
    const scalars: Array<keyof MetaTagsConfig> = [
      'title', 'titleTemplate', 'description', 'author', 'generator',
      'canonical', 'robots', 'googlebot', 'siteName', 'baseUrl',
      'locale', 'themeColor', 'viewport', 'charset'
    ];
    for (const key of scalars) {
      if (config[key] !== undefined) {
        (result[key] as any) = config[key];
      }
    }

    // Merge keywords (array union)
    if (config.keywords) {
      result.keywords = Array.from(new Set([...(result.keywords || []), ...config.keywords]));
    }

    // Merge hreflang (array union by lang)
    if (config.hreflang) {
      const existing = result.hreflang || [];
      const merged = [...existing];
      for (const entry of config.hreflang) {
        const idx = merged.findIndex(e => e.lang === entry.lang);
        if (idx > -1) {
          merged[idx] = entry; // overwrite duplicate lang entry
        } else {
          merged.push(entry);
        }
      }
      result.hreflang = merged;
    }

    // Merge hints (array union by href + rel)
    if (config.hints) {
      const existing = result.hints || [];
      const merged = [...existing];
      for (const hint of config.hints) {
        const idx = merged.findIndex(h => h.href === hint.href && h.rel === hint.rel);
        if (idx > -1) {
          merged[idx] = { ...merged[idx], ...hint };
        } else {
          merged.push(hint);
        }
      }
      result.hints = merged;
    }

    // Merge extra (array union of custom tags)
    if (config.extra) {
      result.extra = [...(result.extra || []), ...config.extra];
    }

    // Merge JSON-LD (stacking array - they do not override, they stack)
    if (config.jsonLd) {
      const currentJsonLd = result.jsonLd
        ? Array.isArray(result.jsonLd)
          ? result.jsonLd
          : [result.jsonLd]
        : [];
      const nextJsonLd = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd];
      result.jsonLd = [...currentJsonLd, ...nextJsonLd];
    }

    // Deep merge objects: og, twitter, pwa, security, env
    const objects: Array<'og' | 'twitter' | 'pwa' | 'security' | 'env'> = ['og', 'twitter', 'pwa', 'security', 'env'];
    for (const key of objects) {
      if (config[key] !== undefined) {
        result[key] = mergeObjects(result[key], config[key]) as any;
      }
    }
  }

  return result;
}

function mergeObjects(target: any, source: any): any {
  if (!source) return target;
  if (!target) return { ...source };

  const merged = { ...target };
  for (const k of Object.keys(source)) {
    const val = source[k];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      merged[k] = mergeObjects(merged[k], val);
    } else {
      merged[k] = val;
    }
  }
  return merged;
}
