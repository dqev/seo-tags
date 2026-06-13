import { buildTags } from 'seo-tags';
import { buildMetadata } from 'seo-tags/next';
import { buildMeta } from 'seo-tags/remix';
import { buildSitemap } from 'seo-tags/sitemap';

console.log('--- Sandbox: Testing Core meta-tags builder ---');
const tags = buildTags({
  title: 'Sandbox Testing Page',
  description: 'Testing local framework adapters and builders.',
  canonical: 'https://example.com/sandbox'
});
console.log('Compiled tags HTML output:');
console.log(tags.toString());
console.log();

console.log('--- Sandbox: Testing Next.js buildMetadata adapter ---');
const nextMeta = buildMetadata({
  title: 'Next JS Page',
  description: 'Next JS description text',
  canonical: 'https://example.com/next-sandbox'
});
console.log('Next JS Metadata mapping:');
console.dir(nextMeta, { depth: null });
console.log();

console.log('--- Sandbox: Testing Remix buildMeta adapter ---');
const remixMeta = buildMeta({
  title: 'Remix Route',
  description: 'Remix description text'
});
console.log('Remix MetaDescriptors:');
console.log(remixMeta);
console.log();

console.log('--- Sandbox: Testing Sitemap xml builder ---');
const sitemap = buildSitemap({
  baseUrl: 'https://example.com',
  routes: [
    { path: '/', priority: 1.0, changeFreq: 'daily' },
    { path: '/sandbox', priority: 0.8, changeFreq: 'weekly' }
  ]
});
console.log('XML Sitemap:');
console.log(sitemap.toXML());
console.log();

console.log('✅ All local sandbox imports check completed successfully!');
