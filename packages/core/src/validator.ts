import type { MetaTagsConfig } from './types.js';

declare const process: any;

/**
 * Validates the metadata configuration object in development environments.
 * Emits console.error and console.warn statements matching the 14 rules
 * defined in the package specification.
 */
export function validateConfig(config: MetaTagsConfig): void {
  // Safe dev-mode detection: only validate if process.env.NODE_ENV is 'development'
  let isDev = false;
  try {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      isDev = true;
    }
  } catch {
    // Fallback if process.env is not accessible
  }

  if (!isDev) return;

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Title Rules (missing, too long > 60, too short < 10)
  if (!config.title) {
    errors.push('✗ title is missing — Google requires a title tag.');
  } else {
    const len = config.title.length;
    if (len > 60) {
      warnings.push(`⚠ title is ${len} chars (limit: 60) — Google will truncate: "${config.title.slice(0, 30)}..."`);
    } else if (len < 10) {
      warnings.push(`⚠ title is ${len} chars — too short. Consider writing a descriptive title between 10 and 60 chars.`);
    }
  }

  // 2. Description Rules (missing, too long > 160, too short < 50)
  if (!config.description) {
    warnings.push('⚠ description is missing — search engines may auto-generate snippets from page body.');
  } else {
    const len = config.description.length;
    if (len > 160) {
      warnings.push(`⚠ description is ${len} chars (limit: 160) — Google will truncate in SERPs.`);
    } else if (len < 50) {
      warnings.push(`⚠ description is ${len} chars — too short. Google may auto-generate one from page content.`);
    }
  }

  // 3. Canonical URL
  if (!config.canonical) {
    warnings.push('⚠ canonical is missing — duplicate content risk. Google may pick the wrong URL to index.');
  }

  // 4. Open Graph Image Rules (missing, relative path, alt missing, dimensions missing)
  const ogImage = config.og?.image;
  if (!ogImage) {
    errors.push('✗ og.image is missing — social previews (LinkedIn, Slack, iMessage) will show a blank card.');
  } else {
    let url: string | undefined;
    let hasAlt = false;
    let hasDimensions = false;

    if (typeof ogImage === 'string') {
      url = ogImage;
      hasAlt = !!config.og?.imageAlt;
    } else if (Array.isArray(ogImage)) {
      const firstImg = ogImage[0];
      if (firstImg) {
        if (typeof firstImg === 'string') {
          url = firstImg;
          hasAlt = !!config.og?.imageAlt;
        } else {
          url = firstImg.url;
          hasAlt = !!firstImg.alt;
          hasDimensions = firstImg.width !== undefined && firstImg.height !== undefined;
        }
      }
    } else {
      url = ogImage.url;
      hasAlt = !!ogImage.alt;
      hasDimensions = ogImage.width !== undefined && ogImage.height !== undefined;
    }

    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      errors.push(`✗ og.image is a relative URL "${url}" — social crawlers cannot resolve relative paths. Use an absolute URL.`);
    }

    if (!hasAlt) {
      warnings.push('⚠ og.image.alt is missing — required for accessibility and screen-reader previews.');
    }

    if (!hasDimensions) {
      warnings.push('⚠ og.image dimensions unknown — set og.image.width and og.image.height for faster rendering.');
    }
  }

  // 5. Twitter card site
  if (config.twitter && !config.twitter.site) {
    warnings.push('⚠ twitter.site missing — add twitter.site to your provider config.');
  }

  // 6. hreflang configuration
  if (config.hreflang && config.hreflang.length > 0) {
    const hasDefault = config.hreflang.some(entry => entry.lang.toLowerCase() === 'x-default');
    if (!hasDefault) {
      errors.push('✗ hreflang entries present but x-default is missing — Google requires an x-default entry.');
    }
  }

  // 7. Article publishedTime check
  if (config.og?.type === 'article' && !config.og.publishedTime) {
    warnings.push('⚠ Article og.type set but article.publishedTime is missing — date is required for news indexing.');
  }

  // 8. Robots index in production checks
  let isProd = false;
  try {
    isProd = (config.env?.currentEnv === 'production') ||
             (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production');
  } catch {
    // Safe bypass
  }

  if (isProd && config.robots) {
    let robotsStr = '';
    if (typeof config.robots === 'string') {
      robotsStr = config.robots;
    } else {
      const parts: string[] = [];
      if (config.robots.index !== undefined) parts.push(config.robots.index ? 'index' : 'noindex');
      if (config.robots.follow !== undefined) parts.push(config.robots.follow ? 'follow' : 'nofollow');
      robotsStr = parts.join(', ');
    }

    const noindexOn = config.env?.noindexOn || [];
    if (robotsStr.includes('noindex') && !noindexOn.includes('production')) {
      warnings.push('⚠ robots index is set to false in production — this will prevent search engines from indexing the page.');
    }
  }

  // Print findings to the console
  errors.forEach(err => console.error(`[meta-tags] ${err}`));
  warnings.forEach(warn => console.warn(`[meta-tags] ${warn}`));
}
