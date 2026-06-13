import { validateConfig } from 'seo-tags';

declare const process: any;

/**
 * Fetches a live URL page, parses its title, links, and meta elements,
 * and runs standard SEO validation rules.
 */
export async function validateCommand(urlInput: string): Promise<void> {
  console.log(`Fetching ${urlInput}...`);
  try {
    const res = await fetch(urlInput);
    if (!res.ok) {
      console.error(`✗ Failed to fetch URL. HTTP status: ${res.status}`);
      return;
    }
    const html = await res.text();

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : undefined;

    const metaTags: any[] = [];
    const metaRegex = /<meta\s+([^>]*?)\/?>/gi;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
      metaTags.push(parseAttrs(match[1]));
    }

    const links: any[] = [];
    const linkRegex = /<link\s+([^>]*?)\/?>/gi;
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(parseAttrs(match[1]));
    }

    const config: any = { title };

    const descMeta = metaTags.find(m => m.name?.toLowerCase() === 'description');
    if (descMeta) config.description = descMeta.content;

    const keywordsMeta = metaTags.find(m => m.name?.toLowerCase() === 'keywords');
    if (keywordsMeta) {
      config.keywords = keywordsMeta.content?.split(',').map((k: string) => k.trim());
    }

    const canonicalLink = links.find(l => l.rel?.toLowerCase() === 'canonical');
    if (canonicalLink) config.canonical = canonicalLink.href;

    const og: any = {};
    const twitter: any = {};

    for (const meta of metaTags) {
      const prop = meta.property;
      const name = meta.name;
      const content = meta.content;

      if (prop && prop.toLowerCase().startsWith('og:')) {
        const key = prop.slice(3);
        if (key.toLowerCase() === 'image') {
          if (!og.image) {
            og.image = content;
          } else if (Array.isArray(og.image)) {
            og.image.push(content);
          } else {
            og.image = [og.image, content];
          }
        } else {
          og[key] = content;
        }
      }

      if (name && name.toLowerCase().startsWith('twitter:')) {
        const key = name.slice(8);
        twitter[key] = content;
      }
    }

    config.og = og;
    config.twitter = twitter;

    console.log('\nRunning SEO Audits...\n');
    validateConfig(config);

    process.env.NODE_ENV = originalEnv;
    console.log('\nSEO validation completed.');
  } catch (error: any) {
    console.error('✗ Failed to validate URL:', error.message);
  }
}

function parseAttrs(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w+(?:-\w+)*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = regex.exec(attrsStr)) !== null) {
    const key = match[1];
    const val = match[2] || match[3] || match[4];
    attrs[key] = val;
  }
  return attrs;
}
