# `meta-tags`

[![npm version](https://img.shields.io/npm/v/meta-tags.svg?style=flat-square)](https://www.npmjs.com/package/meta-tags)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C5KB-brightgreen?style=flat-square)](https://bundlephobia.com/package/meta-tags)
[![license](https://img.shields.io/npm/l/meta-tags.svg?style=flat-square)](https://github.com/dqev/meta-tags/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](https://github.com/dqev/meta-tags/pulls)

One API. Every meta tag. Every framework. Zero guesswork.

<p align="left">
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" width="30" height="30" alt="React" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" width="30" height="30" alt="Next.js" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/remix.svg" width="30" height="30" alt="Remix" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/astro.svg" width="30" height="30" alt="Astro" />&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/svelte.svg" width="30" height="30" alt="SvelteKit" />
</p>

---

## The 30-Second Pitch

Managing SEO meta tags, Open Graph, Twitter cards, and structured JSON-LD schemas is notoriously fragmented, leading to broken social previews and duplicate content issues. Developers are forced to stitch together 4-6 different packages, resulting in race conditions, hydration mismatches, and bloated bundle footprints. `meta-tags` provides a unified, SSR-safe, ultra-lightweight library that cascades defaults gracefully, auto-derives tags recursively, and validates your configuration in development mode.

---

## Quick Start

Install the package:

```bash
pnpm add meta-tags
```

Render meta tags immediately:

```typescript
import { buildTags } from 'meta-tags';

const html = buildTags({
  title: 'My Page',
  description: 'A brief description of my high-performance webpage.',
  canonical: 'https://example.com/page'
}).toString();
```

---

## Feature Comparison

| Feature | react-helmet-async | next-seo | @vercel/metadata | **meta-tags** |
|:---|:---:|:---:|:---:|:---:|
| **React 18 Concurrent** | ✗ | ✅ | ✅ | **✅** |
| **SSR Streaming Safe** | ✗ | N/A | ✅ | **✅** |
| **Next.js App Router** | ✗ | Partial | ✅ | **✅** |
| **Next.js Pages Router** | ✅ | ✅ | N/A | **✅** |
| **Remix** | ✗ | ✗ | ✗ | **✅** |
| **Astro** | ✗ | ✗ | ✗ | **✅** |
| **SvelteKit** | ✗ | ✗ | ✗ | **✅** |
| **Vanilla JS** | ✗ | ✗ | ✗ | **✅** |
| **Auto OG from Title/Desc** | ✗ | ✗ | ✗ | **✅** |
| **Auto Twitter from OG** | ✗ | ✗ | ✗ | **✅** |
| **JSON-LD Schemas** | ✗ | 5 schemas | ✗ | **12 schemas** |
| **OG Image Generation** | ✗ | ✗ | ✗ | **✅** |
| **Sitemap Builder** | ✗ | ✗ | ✗ | **✅** |
| **Robots.txt Builder** | ✗ | ✗ | ✗ | **✅** |
| **PWA Meta Tags** | ✗ | ✗ | ✗ | **✅** |
| **Security Meta Tags** | ✗ | ✗ | ✗ | **✅** |
| **Resource Hints** | ✗ | ✗ | ✗ | **✅** |
| **hreflang / i18n** | ✗ | ✅ | ✅ | **✅** |
| **Environment noindex** | ✗ | ✗ | ✗ | **✅** |
| **Dev-mode validation** | ✗ | ✗ | ✗ | **✅** |
| **CLI audit tool** | ✗ | ✗ | ✗ | **✅** |
| **Tag cascade / inheritance** | ✗ | ✗ | ✗ | **✅** |
| **Bundle Size (min+gz)** | ~13KB | ~10KB | N/A | **< 5KB core** |

---

## Framework Integration Examples

### React & Vite
```tsx
import { MetaTagsProvider, MetaTags } from 'meta-tags/react';

function App() {
  return (
    <MetaTagsProvider defaults={{ siteName: 'My App', titleTemplate: '%s | My App' }}>
      <MetaTags title="Home" description="Welcome to our page." />
      {/* ... */}
    </MetaTagsProvider>
  );
}
```

### Next.js App Router
```ts
// app/page.tsx
import { buildMetadata } from 'meta-tags/next';

export const metadata = buildMetadata({
  title: 'Home',
  titleTemplate: '%s | My Next App',
  description: 'App Router compatibility with zero client-side bundle size.'
});

export default function Page() {
  return <h1>My Page</h1>;
}
```

### Remix
```tsx
import { buildMeta } from 'meta-tags/remix';

export function meta() {
  return buildMeta({
    title: 'My Remix Route',
    description: 'Resolves to Remix v2 flat meta descriptor array.'
  });
}
```

### Astro
```astro
---
import MetaTags from 'meta-tags/astro';
---
<html>
  <head>
    <MetaTags title="Astro Page" description="Astro framework adapter." />
  </head>
  <body>
    <h1>Astro</h1>
  </body>
</html>
```

### SvelteKit
```svelte
<script>
  import MetaTags from 'meta-tags/svelte';
</script>

<MetaTags title="Svelte Page" description="Svelte framework adapter." />
```

---

## JSON-LD Structured Data

`meta-tags` supports 12 fully typed schemas matching schema.org specifications:

- `Article` (Headlines, author context, publishing dates)
- `Product` (Price, reviews, sku, currency, availability)
- `Breadcrumb` (Step list structure)
- `Organization` (Logo, founding details, social profiles)
- `Person` (Job titles, handles, associations)
- `FAQ` (Question & answer list)
- `Event` (Status, attendance modes, locations, price offers)
- `Recipe` (Preparation time, ingredients, instruction list)
- `VideoObject` (Duration, thumbnail URL, upload dates)
- `SoftwareApplication` (System requirements, offers, version)
- `LocalBusiness` (Address, geolocation lat/lng, opening hours)
- `Review` (Rating value, reviewer name, review body)

Example usage in React:
```tsx
import { JsonLd } from 'meta-tags/react';

<JsonLd
  schema="Product"
  data={{
    name: 'Awesome Widget',
    description: 'State-of-the-art widget.',
    price: 49.99,
    currency: 'USD',
    availability: 'InStock'
  }}
/>
```

---

## CLI Commands

`meta-tags` comes with an integrated CLI to manage configuration and perform site audits:

```bash
# Initialize a boilerplate configuration (meta-tags.config.ts)
npx meta-tags init

# Scan routing folders and audit metadata coverage
npx meta-tags audit

# Crawl and validate meta tags on a live website
npx meta-tags validate https://example.com
```

---

## Dev-Mode Warnings

To keep production bundles completely tiny, the dev-mode SEO validation is tree-shaken in production. In development, the library logs rich, detailed feedback about missing parameters, bad lengths, relative OG images, and missing resource hints.

```
[meta-tags] ✗ og.image is missing — social previews (LinkedIn, Slack, iMessage) will show a blank card.
[meta-tags] ✗ og.image is a relative URL "/image.jpg" — social crawlers cannot resolve relative paths. Use an absolute URL.
[meta-tags] ⚠ title is 74 chars (limit: 60) — Google will truncate.
```

---

## Bundle Size Footprint

Verified Brotli bundle size limits:

| Export | Footprint | Target Limit |
|:---|:---:|:---:|
| `meta-tags` (Core Builder & Schemas) | **5.67 KB** | < 6.0 KB |
| `meta-tags/react` (Hooks + Context) | **6.39 KB** | < 7.0 KB |
| `meta-tags/next` (buildMetadata RSC) | **3.15 KB** | < 4.0 KB |
| Adapters (`remix`, `astro`, `svelte`) | **< 1.0 KB** | < 1.0 KB |

---

## Contributing

We welcome contributions to adapters, structured schemas, and bug fixes! See [CONTRIBUTING.md](https://github.com/dqev/meta-tags/blob/main/CONTRIBUTING.md) for local environment setup guidelines.

---

## License

MIT © [Dev Chauhan](https://devchauhan.in)

---

*Built with passion by [Dev Chauhan](https://devchauhan.in) · [@devchauhann3](https://twitter.com/devchauhann3) · [github.com/dqev](https://github.com/dqev)*
