# `meta-tags` — Complete Package Specification & Build Prompt

> **One API. Every meta tag. Every framework. Zero guesswork.**
>
> A universal, SSR-safe, fully-typed npm package for managing SEO meta tags, Open Graph,
> Twitter Cards, JSON-LD structured data, PWA tags, security meta, sitemaps, robots.txt,
> and OG image generation — across React, Next.js, Remix, Astro, SvelteKit, and plain HTML.

---

## Table of Contents

1. [Why meta-tags Exists](#1-why-meta-tags-exists)
2. [Package Identity](#2-package-identity)
3. [Core Design Principles](#3-core-design-principles)
4. [Monorepo Architecture](#4-monorepo-architecture)
5. [Tag Inheritance & Cascade Model](#5-tag-inheritance--cascade-model)
6. [Full TypeScript Interface Reference](#6-full-typescript-interface-reference)
7. [Framework Adapters — API Design](#7-framework-adapters--api-design)
   - 7.1 React / Vite
   - 7.2 Next.js App Router
   - 7.3 Next.js Pages Router
   - 7.4 Remix
   - 7.5 Astro
   - 7.6 SvelteKit
   - 7.7 Vanilla JS / HTML
8. [JSON-LD Structured Data Schemas](#8-json-ld-structured-data-schemas)
9. [Sitemap Builder](#9-sitemap-builder)
10. [robots.txt Builder](#10-robotstxt-builder)
11. [OG Image Generation](#11-og-image-generation)
12. [PWA Meta Tags](#12-pwa-meta-tags)
13. [Security & HTTP-Equiv Meta Tags](#13-security--http-equiv-meta-tags)
14. [Performance Resource Hints](#14-performance-resource-hints)
15. [Internationalisation & hreflang](#15-internationalisation--hreflang)
16. [Environment-Aware Meta](#16-environment-aware-meta)
17. [Full HTML Tag Output Reference](#17-full-html-tag-output-reference)
18. [Dev-Mode Validation & Audit System](#18-dev-mode-validation--audit-system)
19. [CLI — `meta-tags` Command](#19-cli--meta-tags-command)
20. [Technical Implementation Details](#20-technical-implementation-details)
21. [Bundle Size Targets](#21-bundle-size-targets)
22. [Testing Strategy](#22-testing-strategy)
23. [CI/CD Pipeline](#23-cicd-pipeline)
24. [Publishing & Versioning](#24-publishing--versioning)
25. [Competitive Analysis](#25-competitive-analysis)
26. [Implementation Phases](#26-implementation-phases)
27. [package.json Reference](#27-packagejson-reference)
28. [npm README Spec](#28-npm-readme-spec)

---

## 1. Why meta-tags Exists

Every popular SEO library in the ecosystem has a critical flaw:

| Problem | react-helmet-async | next/head | next-seo | This package |
|---|---|---|---|---|
| SSR streaming race conditions | ✗ Known, unfixed | ✗ Partial | N/A | ✅ Safe |
| React 18+ Concurrent Mode support | ✗ Broken | ✅ | ✅ | ✅ |
| Next.js App Router (RSC) | ✗ | Native only | ✗ Broken | ✅ |
| Remix / Vite support | ✗ | ✗ | ✗ | ✅ |
| Astro support | ✗ | ✗ | ✗ | ✅ |
| SvelteKit support | ✗ | ✗ | ✗ | ✅ |
| Auto OG derivation from title/desc | ✗ | ✗ | Partial | ✅ |
| Twitter Card auto-derived from OG | ✗ | ✗ | ✗ | ✅ |
| JSON-LD schemas built-in | ✗ | ✗ | ✅ (limited) | ✅ 12 schemas |
| OG image generation | ✗ | ✗ | ✗ | ✅ |
| Sitemap builder | ✗ | ✗ | ✗ | ✅ |
| robots.txt builder | ✗ | ✗ | ✗ | ✅ |
| PWA meta tags | ✗ | ✗ | ✗ | ✅ |
| Security meta (CSP, X-Frame) | ✗ | ✗ | ✗ | ✅ |
| Resource hints (preload/prefetch) | ✗ | ✗ | ✗ | ✅ |
| hreflang / i18n | ✗ | ✗ | ✅ | ✅ |
| Dev-mode validation warnings | ✗ | ✗ | ✗ | ✅ |
| CLI audit tool | ✗ | ✗ | ✗ | ✅ |
| Tag inheritance / cascade | ✗ | ✗ | ✗ | ✅ |
| Environment-aware meta (noindex staging) | ✗ | ✗ | ✗ | ✅ |
| Bundle size | ~13KB | Next only | ~10KB | < 5KB core |
| TypeScript-first | Partial | ✅ | ✅ | ✅ Full |

**The real problem:** developers piece together 4-6 different solutions, get inconsistent tag output, miss critical SEO fields, and ship broken OG previews to production. `meta-tags` is the single package that covers the entire surface.

---

## 2. Package Identity

```
npm name:      meta-tags
scoped alt:    @dqev/meta-tags
version:       0.1.0
tagline:       One API. Every meta tag. Every framework.
author:        Dev Chauhan <dev@devchauhan.in> (https://devchauhan.in)
github:        github.com/dqev/meta-tags
twitter:       @devchauhann3
license:       MIT
node:          >=18.0.0
```

**Exports map:**
```
meta-tags           → core (framework-agnostic builder)
meta-tags/react     → React + Vite adapter
meta-tags/next      → Next.js App Router + Pages Router adapter
meta-tags/remix     → Remix adapter
meta-tags/astro     → Astro adapter
meta-tags/svelte    → SvelteKit adapter
meta-tags/og        → OG image generation (Edge-compatible)
meta-tags/sitemap   → Sitemap + robots.txt builders
```

---

## 3. Core Design Principles

### 3.1 Last Writer Wins
Tags defined closer to the page override site-wide defaults. The cascade order (lowest to highest priority):

```
Provider defaults → Layout defaults → Page-level → Component-level
```

### 3.2 Auto-Derivation
If you set `title` and `description`, the library auto-fills:
- `og:title` ← `title`
- `og:description` ← `description`
- `og:url` ← current URL (SSR-aware)
- `twitter:title` ← `og:title`
- `twitter:description` ← `og:description`
- `twitter:image` ← `og:image`
- `twitter:card` ← `"summary_large_image"` if og.image present, else `"summary"`

You only need to explicitly set fields when deviating from auto-derived values.

### 3.3 Zero Config Bootstrap
```tsx
<MetaTags title="My App" description="What we do." />
```
This single line produces ~18 correct meta tags. A developer gets 80% of their SEO right with one component.

### 3.4 Fail Loudly in Dev, Silently in Prod
In `development`, console warnings for every SEO mistake.
In `production`, no warnings, no extra bytes — strip-dead-code friendly.

### 3.5 SSR-First, Not SSR-Compatible
The library is designed for SSR from the ground up, not bolted on. Every adapter has a server-side rendering path that is the primary path, not an afterthought.

### 3.6 No Runtime DOM Hacks
Unlike `react-helmet`, `meta-tags` does not iterate `document.head.children` and diff manually. It uses framework-native mechanisms: React portals with `document.head` as target (client), `renderToStaticMarkup` collection (SSR), or `generateMetadata` (Next.js App Router).

---

## 4. Monorepo Architecture

```
meta-tags/                          ← root (Turborepo)
│
├── packages/
│   ├── core/                       ← meta-tags (main entry)
│   │   ├── src/
│   │   │   ├── index.ts            ← public API exports
│   │   │   ├── builder.ts          ← MetaTagBuilder class
│   │   │   ├── dedup.ts            ← deduplication engine
│   │   │   ├── derive.ts           ← auto-derivation logic
│   │   │   ├── validator.ts        ← dev-mode validation rules
│   │   │   ├── cascade.ts          ← inheritance/merge logic
│   │   │   ├── env.ts              ← environment detection + noindex injection
│   │   │   ├── types.ts            ← all TypeScript interfaces (source of truth)
│   │   │   └── schemas/            ← JSON-LD schema builders
│   │   │       ├── article.ts
│   │   │       ├── product.ts
│   │   │       ├── breadcrumb.ts
│   │   │       ├── organization.ts
│   │   │       ├── person.ts
│   │   │       ├── faq.ts
│   │   │       ├── event.ts
│   │   │       ├── recipe.ts
│   │   │       ├── video.ts
│   │   │       ├── software.ts
│   │   │       ├── local-business.ts
│   │   │       ├── review.ts
│   │   │       └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── react/                      ← meta-tags/react
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── MetaTags.tsx        ← main component
│   │   │   ├── MetaTagsProvider.tsx← site-wide defaults context
│   │   │   ├── useMetaTags.ts      ← hook API
│   │   │   ├── JsonLd.tsx          ← structured data component
│   │   │   ├── HeadManager.ts      ← SSR head collector
│   │   │   └── ServerMetaTags.tsx  ← SSR-safe renderer
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── next/                       ← meta-tags/next
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── buildMetadata.ts    ← generateMetadata() helper
│   │   │   ├── JsonLd.tsx          ← RSC-safe server component
│   │   │   └── buildSitemap.ts     ← sitemap.ts helper
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── remix/                      ← meta-tags/remix
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── buildMeta.ts        ← V2 meta() export helper
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── astro/                      ← meta-tags/astro
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── MetaTags.astro      ← Astro component
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── svelte/                     ← meta-tags/svelte
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── MetaTags.svelte     ← Svelte component (uses svelte:head)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── og/                         ← meta-tags/og
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── OgImageBuilder.ts   ← image builder using @vercel/og
│   │   │   └── templates/          ← prebuilt OG image templates
│   │   │       ├── minimal.tsx
│   │   │       ├── blog.tsx
│   │   │       └── product.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                        ← meta-tags CLI
│       ├── src/
│       │   ├── index.ts            ← commander entry
│       │   ├── commands/
│       │   │   ├── init.ts         ← npx meta-tags init
│       │   │   ├── audit.ts        ← npx meta-tags audit
│       │   │   └── validate.ts     ← npx meta-tags validate <url>
│       │   └── utils/
│       │       ├── scanner.ts      ← route scanner
│       │       └── reporter.ts     ← terminal output formatter
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── docs/                       ← Documentation site (Astro + Starlight)
│   │   └── src/content/docs/       ← MDX docs per topic
│   └── playground/                 ← Vite + React sandbox (StackBlitz embed)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  ← test + lint on every PR
│       └── release.yml             ← changesets + npm publish on main
│
├── turbo.json
├── pnpm-workspace.yaml
├── .changeset/
└── README.md
```

---

## 5. Tag Inheritance & Cascade Model

Tags are resolved through a four-level cascade. Each level merges with the level below it, with higher levels winning on conflict:

```
Level 1 (lowest):  MetaTagsProvider defaults
Level 2:           Layout-level MetaTags (e.g. root layout.tsx)
Level 3:           Page-level MetaTags
Level 4 (highest): Component-level MetaTags (overrides everything)
```

**Merge rules:**
- Scalar fields (title, description, robots): last writer wins
- Object fields (og, twitter): deep merge, last writer wins per key
- Array fields (hreflang, preload): union — both sets are injected
- JSON-LD: each `<JsonLd>` renders its own `<script>` tag — they stack, not replace

**Example cascade:**
```tsx
// Root layout — sets site-wide defaults
<MetaTagsProvider defaults={{
  siteName: 'My Site',
  titleTemplate: '%s | My Site',
  robots: 'index, follow',
  twitter: { site: '@mysite' },
  defaultOgImage: '/og-default.png',
}} />

// Blog layout — adds blog-specific OG type
<MetaTags og={{ type: 'article' }} />

// Individual post page — overrides title, description, image
<MetaTags
  title="My Post"                       // → "My Post | My Site" (titleTemplate applied)
  description="Post excerpt"
  og={{ image: '/post-image.png' }}     // overrides defaultOgImage
/>

// Final resolved output:
// title:           "My Post | My Site"
// description:     "Post excerpt"
// robots:          "index, follow"       (from provider)
// og.type:         "article"             (from blog layout)
// og.image:        "/post-image.png"     (from post — wins over default)
// og.title:        "My Post"             (auto-derived)
// og.description:  "Post excerpt"        (auto-derived)
// twitter.site:    "@mysite"             (from provider)
// twitter.card:    "summary_large_image" (auto-derived from og.image)
```

---

## 6. Full TypeScript Interface Reference

```typescript
// ─── Core Config ────────────────────────────────────────────────────────────

export interface MetaTagsConfig {
  // Page identity
  title?: string
  titleTemplate?: string        // e.g. "%s | MySite" — %s replaced by title
  description?: string
  keywords?: string[]           // rendered as comma-separated meta[name=keywords]
  author?: string
  generator?: string            // e.g. "Next.js"

  // Indexing
  canonical?: string            // absolute or relative URL
  robots?: RobotsDirective | string
  googlebot?: string            // separate googlebot directive if needed

  // Site identity
  siteName?: string
  baseUrl?: string              // used to resolve relative canonical/OG URLs
  locale?: string               // e.g. "en_US" — sets og:locale
  alternateLocales?: string[]   // og:locale:alternate

  // Open Graph
  og?: OGConfig

  // Twitter Card
  twitter?: TwitterConfig

  // Structured data
  jsonLd?: JsonLdInput | JsonLdInput[]

  // Internationalization
  hreflang?: HreflangEntry[]

  // PWA
  pwa?: PWAConfig

  // Security
  security?: SecurityConfig

  // Performance hints
  hints?: ResourceHintConfig[]

  // Environment
  env?: EnvConfig

  // Misc
  themeColor?: string           // <meta name="theme-color">
  viewport?: string             // defaults to "width=device-width, initial-scale=1"
  charset?: string              // defaults to "UTF-8"
  extra?: ExtraTag[]            // escape hatch for arbitrary tags
}

// ─── Open Graph ─────────────────────────────────────────────────────────────

export type OGType =
  | 'website' | 'article' | 'profile' | 'book'
  | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station'
  | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'

export interface OGConfig {
  title?: string                // auto-derived from MetaTagsConfig.title
  description?: string          // auto-derived from MetaTagsConfig.description
  type?: OGType                 // defaults to "website"
  url?: string                  // auto-derived from canonical
  siteName?: string             // auto-derived from MetaTagsConfig.siteName
  locale?: string               // auto-derived from MetaTagsConfig.locale

  // Image
  image?: string | OGImage | OGImage[]
  imageAlt?: string             // shorthand when image is a string

  // Video (og:video)
  video?: OGVideo | OGVideo[]

  // Audio (og:audio)
  audio?: string

  // Article-specific
  publishedTime?: string        // ISO 8601
  modifiedTime?: string         // ISO 8601
  expirationTime?: string       // ISO 8601
  author?: string | string[]
  section?: string
  tag?: string | string[]

  // Profile-specific
  firstName?: string
  lastName?: string
  username?: string
  gender?: 'male' | 'female'

  // Book-specific
  isbn?: string
  releaseDate?: string
}

export interface OGImage {
  url: string
  secureUrl?: string
  type?: string                 // e.g. "image/jpeg"
  width?: number
  height?: number
  alt?: string
}

export interface OGVideo {
  url: string
  secureUrl?: string
  type?: string                 // e.g. "video/mp4"
  width?: number
  height?: number
}

// ─── Twitter Card ────────────────────────────────────────────────────────────

export type TwitterCard = 'summary' | 'summary_large_image' | 'app' | 'player'

export interface TwitterConfig {
  card?: TwitterCard            // auto-derived: summary_large_image if og.image set
  site?: string                 // @username of the website
  creator?: string              // @username of the content creator
  title?: string                // auto-derived from og.title
  description?: string          // auto-derived from og.description
  image?: string                // auto-derived from og.image
  imageAlt?: string
  // App card
  appNameIphone?: string
  appIdIphone?: string
  appUrlIphone?: string
  appNameIpad?: string
  appIdIpad?: string
  appUrlIpad?: string
  appNameGoogleplay?: string
  appIdGoogleplay?: string
  appUrlGoogleplay?: string
  // Player card
  playerUrl?: string
  playerWidth?: number
  playerHeight?: number
  playerStreamContentType?: string
}

// ─── hreflang ───────────────────────────────────────────────────────────────

export interface HreflangEntry {
  lang: string                  // e.g. "en", "fr", "x-default"
  href: string                  // absolute URL
}

// ─── PWA ────────────────────────────────────────────────────────────────────

export interface PWAConfig {
  themeColor?: string           // <meta name="theme-color">
  backgroundColor?: string      // used in manifest
  manifest?: string             // path to manifest.json: <link rel="manifest">
  appleIcon?: string | AppleIcon[]
  appleStatusBarStyle?: 'default' | 'black' | 'black-translucent'
  mobileWebAppCapable?: boolean // <meta name="mobile-web-app-capable">
  appleWebAppCapable?: boolean  // <meta name="apple-mobile-web-app-capable">
  appleWebAppTitle?: string
  msTileColor?: string
  msTileImage?: string
  applicationName?: string
}

export interface AppleIcon {
  href: string
  sizes?: string                // e.g. "180x180"
}

// ─── Security ────────────────────────────────────────────────────────────────

export interface SecurityConfig {
  contentSecurityPolicy?: string | CSPObject
  xFrameOptions?: 'DENY' | 'SAMEORIGIN'
  xContentTypeOptions?: boolean     // adds "nosniff"
  referrerPolicy?: ReferrerPolicy
  permissionsPolicy?: string
}

export type ReferrerPolicy =
  | 'no-referrer' | 'no-referrer-when-downgrade'
  | 'origin' | 'origin-when-cross-origin'
  | 'same-origin' | 'strict-origin'
  | 'strict-origin-when-cross-origin' | 'unsafe-url'

export interface CSPObject {
  defaultSrc?: string[]
  scriptSrc?: string[]
  styleSrc?: string[]
  imgSrc?: string[]
  connectSrc?: string[]
  fontSrc?: string[]
  objectSrc?: string[]
  mediaSrc?: string[]
  frameSrc?: string[]
  reportUri?: string
  upgradeInsecureRequests?: boolean
}

// ─── Resource Hints ─────────────────────────────────────────────────────────

export type ResourceHintRel =
  | 'preload' | 'prefetch' | 'preconnect'
  | 'dns-prefetch' | 'prerender' | 'modulepreload'

export type ResourceHintAs =
  | 'script' | 'style' | 'image' | 'font'
  | 'fetch' | 'document' | 'audio' | 'video' | 'worker'

export interface ResourceHintConfig {
  rel: ResourceHintRel
  href: string
  as?: ResourceHintAs
  type?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  media?: string
  imageSrcset?: string
  imageSizes?: string
}

// ─── Robots ──────────────────────────────────────────────────────────────────

export interface RobotsDirective {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
  noimageindex?: boolean
  notranslate?: boolean
  nositelinkssearchbox?: boolean
  maxSnippet?: number           // max-snippet:<n>
  maxImagePreview?: 'none' | 'standard' | 'large'
  maxVideoPreview?: number
  unavailableAfter?: string     // ISO date
}

// ─── Environment ─────────────────────────────────────────────────────────────

export interface EnvConfig {
  noindexOn?: string[]          // env names where noindex is forced, e.g. ["staging", "preview"]
  currentEnv?: string           // defaults to process.env.NODE_ENV or VERCEL_ENV
}

// ─── Extra Tags ──────────────────────────────────────────────────────────────

export interface ExtraTag {
  tag: 'meta' | 'link' | 'script'
  attributes: Record<string, string>
}

// ─── Provider ────────────────────────────────────────────────────────────────

export interface MetaTagsDefaults extends MetaTagsConfig {
  titleTemplate?: string        // e.g. "%s | MySite"
  defaultOgImage?: string
}
```

---

## 7. Framework Adapters — API Design

### 7.1 React / Vite

```tsx
// Installation
// pnpm add meta-tags

import { MetaTags, MetaTagsProvider, JsonLd, useMetaTags } from 'meta-tags/react'

// ── Provider (root) ────────────────────────────────────────────────────────

// main.tsx or App.tsx
export default function App() {
  return (
    <MetaTagsProvider
      defaults={{
        siteName: 'My App',
        baseUrl: 'https://myapp.com',
        titleTemplate: '%s | My App',
        defaultOgImage: '/og-default.png',
        twitter: { site: '@myapp' },
        robots: { index: true, follow: true },
        pwa: {
          themeColor: '#1b1b1b',
          appleWebAppCapable: true,
        },
        env: {
          noindexOn: ['staging', 'preview'],
        },
      }}
    >
      {/* Router + pages */}
    </MetaTagsProvider>
  )
}

// ── Component API ─────────────────────────────────────────────────────────

// pages/BlogPost.tsx
import { MetaTags, JsonLd } from 'meta-tags/react'

export default function BlogPost({ post }) {
  return (
    <>
      <MetaTags
        title={post.title}
        description={post.excerpt}
        canonical={`https://myapp.com/blog/${post.slug}`}

        og={{
          type: 'article',
          image: post.coverImage,
          imageAlt: post.imageAlt,
          publishedTime: post.createdAt,
          modifiedTime: post.updatedAt,
          author: post.author.name,
          section: post.category,
          tag: post.tags,
        }}

        twitter={{
          creator: `@${post.author.twitterHandle}`,
        }}

        hreflang={[
          { lang: 'en', href: `https://myapp.com/blog/${post.slug}` },
          { lang: 'fr', href: `https://fr.myapp.com/blog/${post.slug}` },
          { lang: 'x-default', href: `https://myapp.com/blog/${post.slug}` },
        ]}

        hints={[
          { rel: 'preload', href: post.coverImage, as: 'image' },
          { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        ]}
      />

      <JsonLd
        schema="Article"
        data={{
          headline: post.title,
          description: post.excerpt,
          author: { name: post.author.name, url: post.author.url },
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          image: post.coverImage,
          publisher: {
            name: 'My App',
            logo: 'https://myapp.com/logo.png',
          },
        }}
      />
    </>
  )
}

// ── Hook API ──────────────────────────────────────────────────────────────

// Imperative, for dynamic updates (search results, SPAs)
function SearchPage() {
  const [query, setQuery] = useState('')

  useMetaTags({
    title: query ? `Search: ${query}` : 'Search',
    description: `Results for "${query}" on My App`,
    robots: { index: false, follow: true },   // noindex search pages
  }, [query])                                  // re-runs when query changes

  return <SearchUI />
}
```

---

### 7.2 Next.js App Router

```ts
// meta-tags/next → pure generateMetadata() integration
// No runtime injection — works perfectly with React Server Components

// app/blog/[slug]/page.tsx
import { buildMetadata } from 'meta-tags/next'
import { JsonLd } from 'meta-tags/next'

export async function generateMetadata({ params, searchParams }) {
  const post = await getPost(params.slug)

  return buildMetadata({
    title: post.title,
    titleTemplate: '%s | My Blog',
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,        // resolved against baseUrl in next.config

    og: {
      type: 'article',
      image: post.coverImage,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author.name,
      section: post.category,
    },

    twitter: {
      card: 'summary_large_image',
      creator: `@${post.author.handle}`,
    },

    hreflang: [
      { lang: 'en', href: `https://myblog.com/blog/${post.slug}` },
      { lang: 'x-default', href: `https://myblog.com/blog/${post.slug}` },
    ],
  })
  // Returns: Next.js Metadata type — no casting needed
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  return (
    <article>
      {/* JSON-LD as a server component — rendered to <head> correctly */}
      <JsonLd
        schema="Article"
        data={{
          headline: post.title,
          author: { name: post.author.name },
          datePublished: post.createdAt,
          image: post.coverImage,
        }}
      />
      {/* page content */}
    </article>
  )
}

// ── app/layout.tsx — site-wide defaults ────────────────────────────────────

import { buildMetadata } from 'meta-tags/next'

export const metadata = buildMetadata({
  siteName: 'My Blog',
  baseUrl: 'https://myblog.com',
  titleTemplate: '%s | My Blog',
  defaultOgImage: 'https://myblog.com/og-default.png',
  twitter: { site: '@myblog' },
  robots: { index: true, follow: true },
  pwa: {
    themeColor: '#1b1b1b',
    manifest: '/manifest.json',
  },
})
```

---

### 7.3 Next.js Pages Router

```tsx
// pages/blog/[slug].tsx
import { MetaTags, JsonLd } from 'meta-tags/react'

export default function BlogPost({ post }) {
  return (
    <>
      <MetaTags
        title={post.title}
        description={post.excerpt}
        og={{ type: 'article', image: post.coverImage }}
      />
      <JsonLd schema="Article" data={{ headline: post.title, ... }} />
      {/* page content */}
    </>
  )
}

// _app.tsx — site-wide provider
import { MetaTagsProvider } from 'meta-tags/react'

export default function MyApp({ Component, pageProps }) {
  return (
    <MetaTagsProvider defaults={{ siteName: 'My Blog', ... }}>
      <Component {...pageProps} />
    </MetaTagsProvider>
  )
}
```

---

### 7.4 Remix

```tsx
// Remix V2 meta() export
import { buildMeta } from 'meta-tags/remix'

// app/routes/blog.$slug.tsx
export function meta({ data, location }) {
  return buildMeta({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://myblog.com${location.pathname}`,
    og: {
      type: 'article',
      image: data.post.coverImage,
    },
    twitter: { card: 'summary_large_image' },
    siteName: 'My Blog',
  })
  // Returns: MetaDescriptor[] — Remix V2 format
}
```

---

### 7.5 Astro

```astro
---
// src/pages/blog/[slug].astro
import MetaTags from 'meta-tags/astro'
import { JsonLd } from 'meta-tags/astro'
const { post } = Astro.props
---

<html>
  <head>
    <MetaTags
      title={post.title}
      description={post.excerpt}
      og={{ type: 'article', image: post.coverImage }}
      canonical={Astro.url.href}
    />
    <JsonLd
      schema="Article"
      data={{ headline: post.title, datePublished: post.date }}
    />
  </head>
  <body>
    <!-- content -->
  </body>
</html>
```

---

### 7.6 SvelteKit

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  import MetaTags from 'meta-tags/svelte'
  export let data
</script>

<MetaTags
  title={data.post.title}
  description={data.post.excerpt}
  og={{ type: 'article', image: data.post.coverImage }}
/>

<!-- Uses svelte:head internally -->
<!-- page content -->
```

---

### 7.7 Vanilla JS / HTML

```js
import { buildTags } from 'meta-tags'

const tags = buildTags({
  title: 'Hello World',
  description: 'My page',
  og: { image: '/og.png' },
})

// Inject into document.head
tags.inject(document.head)

// Or get as HTML string (for SSR)
const html = tags.toString()
// → '<title>Hello World</title><meta name="description" content="My page">...'
```

---

## 8. JSON-LD Structured Data Schemas

All schemas are typed, validated, and produce correct `@context: "https://schema.org"` output.

```tsx
import { JsonLd } from 'meta-tags/react'

// ── Article ───────────────────────────────────────────────────────────────
<JsonLd schema="Article" data={{
  headline: 'My Article',
  description: 'Article description',
  author: { name: 'Dev Chauhan', url: 'https://devchauhan.in' },
  publisher: { name: 'My Site', logo: 'https://mysite.com/logo.png' },
  datePublished: '2025-01-01T00:00:00Z',
  dateModified: '2025-06-01T00:00:00Z',
  image: 'https://mysite.com/article-image.jpg',
  url: 'https://mysite.com/blog/my-article',
}} />

// ── Product ───────────────────────────────────────────────────────────────
<JsonLd schema="Product" data={{
  name: 'My Product',
  description: 'Product description',
  image: 'https://mysite.com/product.jpg',
  brand: 'My Brand',
  sku: 'SKU-001',
  price: 29.99,
  currency: 'USD',
  availability: 'InStock',        // InStock | OutOfStock | PreOrder
  url: 'https://mysite.com/products/my-product',
  rating: { value: 4.5, count: 120 },
}} />

// ── Breadcrumb ────────────────────────────────────────────────────────────
<JsonLd schema="Breadcrumb" data={{
  items: [
    { name: 'Home', url: 'https://mysite.com' },
    { name: 'Blog', url: 'https://mysite.com/blog' },
    { name: 'My Article', url: 'https://mysite.com/blog/my-article' },
  ]
}} />

// ── Organization ──────────────────────────────────────────────────────────
<JsonLd schema="Organization" data={{
  name: 'My Company',
  url: 'https://mysite.com',
  logo: 'https://mysite.com/logo.png',
  description: 'What we do.',
  foundingDate: '2020',
  sameAs: [
    'https://twitter.com/devchauhann3',
    'https://github.com/dqev',
    'https://linkedin.com/in/devchauhan',
  ],
  contactPoint: {
    type: 'CustomerService',
    telephone: '+1-800-000-0000',
    contactType: 'customer service',
  },
}} />

// ── Person ────────────────────────────────────────────────────────────────
<JsonLd schema="Person" data={{
  name: 'Dev Chauhan',
  url: 'https://devchauhan.in',
  image: 'https://devchauhan.in/avatar.jpg',
  jobTitle: 'Frontend Developer',
  worksFor: { name: 'Freelance', url: 'https://devchauhan.in' },
  sameAs: [
    'https://github.com/dqev',
    'https://twitter.com/devchauhann3',
  ],
  knowsAbout: ['JavaScript', 'React', 'Next.js', 'SEO'],
}} />

// ── FAQ ───────────────────────────────────────────────────────────────────
<JsonLd schema="FAQ" data={{
  questions: [
    { q: 'What is meta-tags?', a: 'A universal SEO meta package.' },
    { q: 'Does it support Next.js?', a: 'Yes, both App and Pages Router.' },
    { q: 'Is it free?', a: 'Yes, MIT licensed.' },
  ]
}} />

// ── Event ─────────────────────────────────────────────────────────────────
<JsonLd schema="Event" data={{
  name: 'JS Conference 2025',
  startDate: '2025-09-15T09:00:00',
  endDate: '2025-09-15T18:00:00',
  location: { name: 'Mumbai', address: 'BKC, Mumbai, India' },
  organizer: { name: 'JSConf India', url: 'https://jsconf.in' },
  description: 'Annual JavaScript conference.',
  image: 'https://jsconf.in/og.png',
  offers: { price: 0, currency: 'INR', availability: 'InStock' },
  eventStatus: 'EventScheduled',
  eventAttendanceMode: 'OfflineEventAttendanceMode',
}} />

// ── Recipe ────────────────────────────────────────────────────────────────
<JsonLd schema="Recipe" data={{
  name: 'Pasta Carbonara',
  description: 'Classic Italian pasta dish.',
  author: 'Dev Chauhan',
  image: 'https://mysite.com/carbonara.jpg',
  prepTime: 'PT10M',
  cookTime: 'PT20M',
  totalTime: 'PT30M',
  servings: '2',
  calories: '650 calories',
  ingredients: ['200g pasta', '100g pancetta', '2 eggs', '50g parmesan'],
  instructions: [
    { text: 'Boil pasta until al dente.' },
    { text: 'Fry pancetta until crispy.' },
    { text: 'Mix eggs and parmesan.' },
    { text: 'Combine and serve.' },
  ],
  rating: { value: 4.8, count: 340 },
}} />

// ── VideoObject ───────────────────────────────────────────────────────────
<JsonLd schema="VideoObject" data={{
  name: 'Meta Tags Tutorial',
  description: 'How to use the meta-tags package.',
  thumbnailUrl: 'https://mysite.com/thumb.jpg',
  uploadDate: '2025-01-15T00:00:00Z',
  duration: 'PT12M30S',
  contentUrl: 'https://mysite.com/video.mp4',
  embedUrl: 'https://youtube.com/embed/xxx',
}} />

// ── SoftwareApplication ───────────────────────────────────────────────────
<JsonLd schema="SoftwareApplication" data={{
  name: 'meta-tags',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: 'https://npmjs.com/package/meta-tags',
  offers: { price: 0, currency: 'USD' },
  description: 'Universal SEO meta tag package.',
  downloadUrl: 'https://npmjs.com/package/meta-tags',
  softwareVersion: '1.0.0',
}} />

// ── LocalBusiness ─────────────────────────────────────────────────────────
<JsonLd schema="LocalBusiness" data={{
  name: 'My Business',
  image: 'https://mybusiness.com/photo.jpg',
  url: 'https://mybusiness.com',
  telephone: '+91-9999999999',
  address: {
    street: '123 Main St',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    postalCode: '250001',
    country: 'IN',
  },
  geo: { lat: 28.9845, lng: 77.7064 },
  openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-14:00'],
  priceRange: '$$',
}} />

// ── Review ────────────────────────────────────────────────────────────────
<JsonLd schema="Review" data={{
  itemName: 'meta-tags npm package',
  reviewBody: 'The best SEO package for React. Saved us hours of setup.',
  ratingValue: 5,
  reviewerName: 'Happy Developer',
  datePublished: '2025-06-01',
}} />

// ── Raw / Custom ──────────────────────────────────────────────────────────
<JsonLd raw={{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My Site',
  url: 'https://mysite.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://mysite.com/search?q={query}' },
    'query-input': 'required name=query',
  },
}} />
```

---

## 9. Sitemap Builder

```ts
// Next.js: app/sitemap.ts
import { buildSitemap } from 'meta-tags/next'
// or
import { buildSitemap } from 'meta-tags/sitemap'

export default async function sitemap() {
  const posts = await getPosts()
  const products = await getProducts()

  return buildSitemap({
    baseUrl: 'https://mysite.com',

    routes: [
      // Static routes
      { path: '/',         priority: 1.0, changeFreq: 'daily'   },
      { path: '/about',    priority: 0.8, changeFreq: 'monthly' },
      { path: '/contact',  priority: 0.6, changeFreq: 'yearly'  },
      { path: '/blog',     priority: 0.9, changeFreq: 'daily'   },

      // Dynamic routes with lastModified
      ...posts.map(post => ({
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt,
        priority: 0.7,
        changeFreq: 'weekly' as const,
        // Alternate language versions
        alternates: [
          { lang: 'en', href: `https://mysite.com/blog/${post.slug}` },
          { lang: 'fr', href: `https://fr.mysite.com/blog/${post.slug}` },
        ],
      })),

      ...products.map(p => ({
        path: `/products/${p.slug}`,
        lastModified: p.updatedAt,
        priority: 0.8,
      })),
    ],

    // Optional: generate image sitemaps
    images: posts.map(post => ({
      loc: post.coverImage,
      caption: post.title,
      title: post.title,
    })),
  })
}

// Output is Next.js-compatible MetadataRoute.Sitemap type.
// For other frameworks, buildSitemap() also has a .toXML() method:
const xml = buildSitemap({ ... }).toXML()
// Returns the full <urlset> XML string for writing to a file or serving as a route.
```

---

## 10. robots.txt Builder

```ts
// Next.js: app/robots.ts
import { buildRobots } from 'meta-tags/next'
// or
import { buildRobots } from 'meta-tags/sitemap'

export default function robots() {
  return buildRobots({
    baseUrl: 'https://mysite.com',

    rules: [
      // Allow all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
      },

      // Block AI training scrapers
      {
        userAgent: ['GPTBot', 'Claude-Web', 'CCBot', 'anthropic-ai'],
        disallow: '/',
      },

      // Googlebot-specific rules
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/search',
        crawlDelay: 1,
      },
    ],

    sitemap: 'https://mysite.com/sitemap.xml',
    host: 'https://mysite.com',

    // Environment guard: return noindex robots for staging
    env: {
      noindexOn: ['staging', 'preview'],
      currentEnv: process.env.VERCEL_ENV,
    },
  })
}

// buildRobots() returns Next.js MetadataRoute.Robots.
// For other frameworks:
const txt = buildRobots({ ... }).toText()
// Returns the plain robots.txt string for writing to public/robots.txt
```

---

## 11. OG Image Generation

```ts
// meta-tags/og — powered by @vercel/og, Edge-compatible

// Next.js: app/og/route.tsx
import { OgImage, OgTemplate } from 'meta-tags/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'My Site'
  const description = searchParams.get('description') ?? ''

  // ── Option 1: Use a built-in template ─────────────────────────────────
  return OgImage({
    template: 'blog',           // 'minimal' | 'blog' | 'product'
    data: {
      title,
      description,
      author: 'Dev Chauhan',
      date: new Date().toLocaleDateString(),
      logo: 'https://devchauhan.in/logo.png',
      accentColor: '#1b1b1b',
    },
    size: { width: 1200, height: 630 },
  })

  // ── Option 2: Custom JSX template ─────────────────────────────────────
  return OgImage({
    template: (
      <div style={{ display: 'flex', background: '#1b1b1b', width: '100%', height: '100%' }}>
        <h1 style={{ color: '#fff', fontSize: 64 }}>{title}</h1>
        <p style={{ color: '#aaa', fontSize: 24 }}>{description}</p>
      </div>
    ),
    size: { width: 1200, height: 630 },
    fonts: [
      { name: 'Inter', data: await fetchFont('Inter', 700), weight: 700 },
    ],
  })
}

// In your page, reference the OG image route:
// og={{ image: `https://mysite.com/og?title=${encodeURIComponent(post.title)}&description=...` }}
```

**Built-in templates:**
- `minimal` — clean white/dark background, large title, subtitle, domain
- `blog` — title + description + author + date + accent bar
- `product` — product name + price + image + brand badge

---

## 12. PWA Meta Tags

```tsx
<MetaTags
  pwa={{
    themeColor: '#1b1b1b',
    backgroundColor: '#ffffff',
    manifest: '/manifest.json',
    mobileWebAppCapable: true,
    appleWebAppCapable: true,
    appleWebAppTitle: 'My App',
    appleStatusBarStyle: 'black-translucent',
    appleIcon: [
      { href: '/icons/apple-touch-icon-180.png', sizes: '180x180' },
      { href: '/icons/apple-touch-icon-152.png', sizes: '152x152' },
      { href: '/icons/apple-touch-icon-120.png', sizes: '120x120' },
    ],
    msTileColor: '#1b1b1b',
    msTileImage: '/icons/mstile-144.png',
    applicationName: 'My App',
  }}
/>
```

**Output:**
```html
<meta name="theme-color" content="#1b1b1b" />
<meta name="background-color" content="#ffffff" />
<link rel="manifest" href="/manifest.json" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="My App" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152.png" />
<link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120.png" />
<meta name="msapplication-TileColor" content="#1b1b1b" />
<meta name="msapplication-TileImage" content="/icons/mstile-144.png" />
<meta name="application-name" content="My App" />
```

---

## 13. Security & HTTP-Equiv Meta Tags

> **Note:** Meta-based security tags are a best-effort supplement. Real security headers must be set at the HTTP server/CDN level (Vercel headers, nginx config, etc.). `meta-tags` provides the meta equivalents for environments where server headers aren't configurable.

```tsx
<MetaTags
  security={{
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.example.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://images.example.com'],
      connectSrc: ["'self'", 'https://api.example.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
    },
    xFrameOptions: 'SAMEORIGIN',
    xContentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
  }}
/>
```

**Output:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; ..." />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

---

## 14. Performance Resource Hints

```tsx
<MetaTags
  hints={[
    // Preload — high-priority fetch, critical path
    { rel: 'preload', href: '/fonts/Inter.woff2', as: 'font', crossOrigin: 'anonymous' },
    { rel: 'preload', href: '/hero-image.webp', as: 'image' },
    { rel: 'preload', href: '/critical.css', as: 'style' },

    // Module preload — for JS modules
    { rel: 'modulepreload', href: '/app.js' },

    // Preconnect — DNS + TLS handshake early
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },

    // DNS prefetch — only DNS lookup
    { rel: 'dns-prefetch', href: 'https://analytics.example.com' },

    // Prefetch — low-priority, next page likely
    { rel: 'prefetch', href: '/next-page-chunk.js', as: 'script' },

    // Prerender — entire page in background
    { rel: 'prerender', href: '/likely-next-page' },

    // Responsive image preload
    {
      rel: 'preload',
      href: '/hero-mobile.webp',
      as: 'image',
      imageSrcset: '/hero-mobile.webp 480w, /hero-tablet.webp 768w, /hero.webp 1200w',
      imageSizes: '(max-width: 768px) 100vw, 1200px',
      media: '(max-width: 768px)',
    },
  ]}
/>
```

---

## 15. Internationalisation & hreflang

```tsx
// Full hreflang setup for a multilingual site
<MetaTags
  locale="en_US"
  alternateLocales={['fr_FR', 'de_DE', 'ja_JP']}

  hreflang={[
    { lang: 'en',       href: 'https://mysite.com/blog/my-post' },
    { lang: 'fr',       href: 'https://mysite.com/fr/blog/my-post' },
    { lang: 'de',       href: 'https://mysite.com/de/blog/my-post' },
    { lang: 'ja',       href: 'https://mysite.com/ja/blog/my-post' },
    { lang: 'x-default', href: 'https://mysite.com/blog/my-post' }, // always include
  ]}
/>
```

**Output:**
```html
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="fr_FR" />
<meta property="og:locale:alternate" content="de_DE" />
<meta property="og:locale:alternate" content="ja_JP" />
<link rel="alternate" hreflang="en"        href="https://mysite.com/blog/my-post" />
<link rel="alternate" hreflang="fr"        href="https://mysite.com/fr/blog/my-post" />
<link rel="alternate" hreflang="de"        href="https://mysite.com/de/blog/my-post" />
<link rel="alternate" hreflang="ja"        href="https://mysite.com/ja/blog/my-post" />
<link rel="alternate" hreflang="x-default" href="https://mysite.com/blog/my-post" />
```

---

## 16. Environment-Aware Meta

```tsx
// Option 1: Via Provider
<MetaTagsProvider
  defaults={{
    env: {
      noindexOn: ['staging', 'preview', 'development'],
      currentEnv: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    },
  }}
/>

// Option 2: Per-page
<MetaTags
  env={{
    noindexOn: ['staging'],
    currentEnv: process.env.VERCEL_ENV,
  }}
/>

// When currentEnv matches noindexOn, the library automatically:
// 1. Sets robots to "noindex, nofollow"
// 2. Removes canonical (prevents staging from being associated with prod URLs)
// 3. Logs a [meta-tags] console.info that noindex is active

// Next.js: buildMetadata() supports the same config
export const metadata = buildMetadata({
  robots: { index: true, follow: true },
  env: {
    noindexOn: ['staging', 'preview'],
    currentEnv: process.env.VERCEL_ENV,
  },
})
```

---

## 17. Full HTML Tag Output Reference

Complete tag output for a fully-configured `<MetaTags>`:

```html
<!-- ── Charset & Viewport (always first) ────────────────────── -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- ── Core SEO ─────────────────────────────────────────────── -->
<title>My Article | My Site</title>
<meta name="description" content="Article description here." />
<meta name="keywords" content="seo, meta tags, react" />
<meta name="author" content="Dev Chauhan" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="googlebot" content="index, follow" />
<link rel="canonical" href="https://mysite.com/blog/my-article" />

<!-- ── Open Graph ────────────────────────────────────────────── -->
<meta property="og:title" content="My Article" />
<meta property="og:description" content="Article description here." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://mysite.com/blog/my-article" />
<meta property="og:site_name" content="My Site" />
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="fr_FR" />
<meta property="og:image" content="https://mysite.com/article-image.jpg" />
<meta property="og:image:secure_url" content="https://mysite.com/article-image.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Article cover image" />
<meta property="article:published_time" content="2025-01-01T00:00:00Z" />
<meta property="article:modified_time" content="2025-06-01T00:00:00Z" />
<meta property="article:author" content="Dev Chauhan" />
<meta property="article:section" content="Technology" />
<meta property="article:tag" content="React" />
<meta property="article:tag" content="SEO" />

<!-- ── Twitter Card ──────────────────────────────────────────── -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@mysite" />
<meta name="twitter:creator" content="@devchauhann3" />
<meta name="twitter:title" content="My Article" />
<meta name="twitter:description" content="Article description here." />
<meta name="twitter:image" content="https://mysite.com/article-image.jpg" />
<meta name="twitter:image:alt" content="Article cover image" />

<!-- ── hreflang ──────────────────────────────────────────────── -->
<link rel="alternate" hreflang="en"        href="https://mysite.com/blog/my-article" />
<link rel="alternate" hreflang="fr"        href="https://mysite.com/fr/blog/my-article" />
<link rel="alternate" hreflang="x-default" href="https://mysite.com/blog/my-article" />

<!-- ── Resource Hints ────────────────────────────────────────── -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/article-image.jpg" as="image" />
<link rel="dns-prefetch" href="https://analytics.example.com" />

<!-- ── PWA ───────────────────────────────────────────────────── -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1b1b1b" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="My App" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png" />

<!-- ── Security ──────────────────────────────────────────────── -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; ..." />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta name="referrer" content="strict-origin-when-cross-origin" />

<!-- ── JSON-LD ───────────────────────────────────────────────── -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "My Article",
  "author": { "@type": "Person", "name": "Dev Chauhan", "url": "https://devchauhan.in" },
  "publisher": { "@type": "Organization", "name": "My Site", "logo": { "@type": "ImageObject", "url": "https://mysite.com/logo.png" } },
  "datePublished": "2025-01-01T00:00:00Z",
  "dateModified": "2025-06-01T00:00:00Z",
  "image": "https://mysite.com/article-image.jpg",
  "url": "https://mysite.com/blog/my-article"
}
</script>
```

---

## 18. Dev-Mode Validation & Audit System

The validator runs in `NODE_ENV=development` only. In production, it's a no-op and is tree-shaken.

### Console Warning Categories

**🔴 Error — will hurt SEO ranking or break previews:**
```
[meta-tags] ✗ og.image is missing — social previews (LinkedIn, Slack, iMessage) will show a blank card.
[meta-tags] ✗ og.image is a relative URL "/image.jpg" — social crawlers cannot resolve relative paths. Use an absolute URL.
[meta-tags] ✗ canonical is missing — duplicate content risk. Google may pick the wrong URL to index.
[meta-tags] ✗ title is missing — Google requires a title tag.
```

**🟡 Warning — suboptimal, will reduce performance:**
```
[meta-tags] ⚠ title is 74 chars (limit: 60) — Google will truncate: "My Very Long Title That Goes Ov..."
[meta-tags] ⚠ description is 172 chars (limit: 160) — Google will truncate in SERPs.
[meta-tags] ⚠ description is 38 chars — too short. Google may auto-generate one from page content.
[meta-tags] ⚠ og.image dimensions unknown — set og.image.width and og.image.height for faster rendering.
[meta-tags] ⚠ og.image.alt is missing — required for accessibility and screen-reader previews.
[meta-tags] ⚠ hreflang entries present but x-default is missing — Google requires an x-default entry.
[meta-tags] ⚠ Article og.type set but article.publishedTime is missing — date is required for news indexing.
[meta-tags] ⚠ No preconnect to external font provider detected — consider adding a preconnect hint.
```

**🔵 Info — auto-derived values in use:**
```
[meta-tags] ℹ twitter.card auto-set to "summary_large_image" (og.image is present). Set explicitly to override.
[meta-tags] ℹ twitter.image auto-derived from og.image.
[meta-tags] ℹ og.title auto-derived from title prop.
[meta-tags] ℹ [ENV] noindex active — VERCEL_ENV is "preview", which matches noindexOn config.
```

### Validation Rules Table

| Rule | Severity | Condition |
|---|---|---|
| title missing | ✗ Error | `title` not set anywhere in cascade |
| title too long | ⚠ Warning | `title` > 60 chars |
| title too short | ⚠ Warning | `title` < 10 chars |
| description missing | ⚠ Warning | `description` not set |
| description too long | ⚠ Warning | `description` > 160 chars |
| description too short | ⚠ Warning | `description` < 50 chars |
| canonical missing | ⚠ Warning | `canonical` not set |
| og.image missing | ✗ Error | `og.image` not set and no `defaultOgImage` |
| og.image relative URL | ✗ Error | `og.image` doesn't start with `http` |
| og.image.alt missing | ⚠ Warning | `og.image` set but `imageAlt` not set |
| og.image dimensions missing | ⚠ Warning | Width/height not in OGImage object |
| twitter.site missing | ⚠ Warning | `twitter.site` not set in provider or page |
| hreflang x-default missing | ✗ Error | hreflang array present but no `x-default` |
| article.publishedTime missing | ⚠ Warning | `og.type === 'article'` but no publishedTime |
| robots noindex in prod | ⚠ Warning | `robots.index === false` and not in noindexOn list |
| JSON-LD schema invalid | ✗ Error | Required schema fields missing |

---

## 19. CLI — `meta-tags` Command

```bash
# One-time setup in any project
npx meta-tags init

# Audit all routes in a Next.js / Vite project
npx meta-tags audit

# Validate meta tags on a live URL
npx meta-tags validate https://devchauhan.in

# Generate sitemap from routes config
npx meta-tags sitemap --base-url https://mysite.com --output ./public/sitemap.xml

# Generate robots.txt
npx meta-tags robots --base-url https://mysite.com --output ./public/robots.txt
```

### `npx meta-tags init`

Interactive setup wizard:
1. Detects framework (Next.js / Vite / Remix / Astro)
2. Asks: site name, base URL, Twitter handle, default OG image path
3. Generates a `meta-tags.config.ts` file:

```ts
// meta-tags.config.ts (generated)
import { defineConfig } from 'meta-tags'

export default defineConfig({
  siteName: 'My Site',
  baseUrl: 'https://mysite.com',
  titleTemplate: '%s | My Site',
  defaultOgImage: '/og-default.png',
  twitter: { site: '@mysite' },
  robots: { index: true, follow: true },
  env: { noindexOn: ['staging', 'preview'] },
})
```

4. Generates example component/layout usage for detected framework
5. Adds `meta-tags` to `package.json` dependencies

### `npx meta-tags audit`

Scans all pages/routes in the project and reports SEO issues:

```
meta-tags audit — scanning 24 routes

ROUTE                          TITLE   DESC    OG IMG   CANONICAL   SCORE
─────────────────────────────────────────────────────────────────────────
/                              ✅ 42ch  ✅      ✅       ✅          100
/about                         ✅ 31ch  ⚠ 38ch  ✅       ✅           85
/blog                          ✅       ✅      ✅       ✅          100
/blog/[slug] (12 pages)        ✅       ✅      ✅       ✅          100
/products                      ✅       ✅      ✗ miss   ✅           60
/products/[id] (8 pages)       ✅       ✅      ✗ miss   ✅           60
/contact                       ✅       ✗ miss  ✅       ✗ miss       55
/sitemap.xml                   N/A     N/A    N/A      N/A         N/A
─────────────────────────────────────────────────────────────────────────
ISSUES: 4 errors, 2 warnings across 24 routes
Run `npx meta-tags audit --fix` for suggested fixes.
```

### `npx meta-tags validate <url>`

Fetches a live URL and checks all meta tags:

```
meta-tags validate https://devchauhan.in

Fetching https://devchauhan.in...

✅ title:       "Dev Chauhan — Frontend Developer" (34 chars)
✅ description: "I build open-source web tools..." (128 chars)
✅ canonical:   https://devchauhan.in
✅ og:title:    "Dev Chauhan — Frontend Developer"
✅ og:image:    https://devchauhan.in/og.png (1200×630)
✅ og:type:     website
✅ twitter:card: summary_large_image
✅ JSON-LD:     Person schema (valid)
⚠ twitter:site missing — add twitter.site to your provider config

SEO Score: 94/100
```

---

## 20. Technical Implementation Details

### SSR Head Collection (React Adapter)

The React adapter uses a context-based head collector pattern:

```
1. MetaTagsProvider creates a HeadManager instance
2. Every <MetaTags> call registers its config with the HeadManager
3. HeadManager merges all configs using the cascade rules
4. On the server: HeadManager.flush() returns a string of all tags
5. On the client: HeadManager triggers a useEffect that writes to document.head
6. On hydration: tags already in <head> from SSR are matched by key and not re-inserted
```

**Tag identity keys** (used for deduplication):
- `<title>` → key: `"title"` (singleton)
- `<meta name="X">` → key: `"meta:name:X"`
- `<meta property="X">` → key: `"meta:property:X"`
- `<link rel="canonical">` → key: `"link:canonical"` (singleton)
- `<link rel="alternate" hreflang="X">` → key: `"link:alternate:hreflang:X"`
- `<script type="application/ld+json">` → key: `"jsonld:N"` (indexed — multiple allowed)

### React 18+ Concurrent Mode

`meta-tags/react` is built for React 18 Concurrent Mode:
- Uses `useSyncExternalStore` instead of `useEffect` for synchronous subscription
- Safe for Suspense boundaries — tags from suspended subtrees are not flushed until the boundary resolves
- `useId()` for stable hydration keys across server/client

### Next.js App Router (React Server Components)

- `buildMetadata()` is a pure function — no React, no hooks, callable in any server context
- `<JsonLd>` in `meta-tags/next` is a Server Component that renders `<script>` directly
- No client bundle contribution for the Next.js adapter

### Edge Runtime Compatibility

All packages are Edge-compatible except `meta-tags/og` which requires Edge explicitly:
- No Node.js built-ins (`fs`, `path`, `http`) in any adapter
- `meta-tags/og` uses `@vercel/og` which is Edge-only

### Remix V2 meta()

Remix V2 changed `meta()` to return `MetaDescriptor[]` instead of objects. `buildMeta()` returns this format, fully typed.

### Tree-shaking

The `sideEffects: false` flag in `package.json` enables aggressive tree-shaking:
- Import only `meta-tags/react` → zero bytes from Next.js, Remix, Astro adapters
- Import only `buildMetadata` → zero bytes from React renderer
- JSON-LD schemas are individually exported — unused schemas are excluded

---

## 21. Bundle Size Targets

| Package | Min + Gzip Target |
|---|---|
| `meta-tags` (core builder only) | < 3 KB |
| `meta-tags/react` (component + hook) | < 5 KB |
| `meta-tags/next` (buildMetadata + JsonLd) | < 2 KB |
| `meta-tags/remix` | < 1 KB |
| `meta-tags/astro` | < 1 KB |
| `meta-tags/svelte` | < 1 KB |
| `meta-tags/react` + all JSON-LD schemas | < 9 KB |
| `meta-tags/og` (OG image gen) | < 4 KB + @vercel/og |
| `meta-tags/sitemap` | < 2 KB |
| CLI | Not bundled for browser |

Bundle size is verified on every PR using `size-limit`.

---

## 22. Testing Strategy

### Unit Tests (Vitest)

```
packages/core/src/__tests__/
├── builder.test.ts         ← MetaTagBuilder: all config combinations → correct tag lists
├── dedup.test.ts           ← deduplication: child wins, provider loses
├── derive.test.ts          ← auto-derivation: OG from title, Twitter from OG
├── cascade.test.ts         ← 4-level cascade: correct merge order
├── validator.test.ts       ← all 14 validation rules fire correctly
├── env.test.ts             ← noindexOn: staging gets noindex
└── schemas/
    └── *.test.ts           ← each JSON-LD schema: valid output, required fields enforced

packages/react/src/__tests__/
├── MetaTags.test.tsx       ← renders correct tags, SSR renderToString
├── MetaTagsProvider.test.tsx ← defaults applied, cascade works
├── useMetaTags.test.ts     ← hook: deps array triggers re-render
└── SSR.test.tsx            ← full SSR: renderToString → tag string → correct HTML

packages/next/src/__tests__/
├── buildMetadata.test.ts   ← returns Next.js Metadata type
└── buildSitemap.test.ts    ← correct urlset XML output
```

### Integration Tests (Playwright)

```
tests/integration/
├── react-vite/             ← Vite + React project: build → test meta in browser
├── next-app-router/        ← Next.js App Router: build → test SSR + hydration
├── next-pages-router/      ← Next.js Pages Router: build → test
└── remix/                  ← Remix: build → test meta export

For each integration test:
1. Build the test project with meta-tags installed
2. Load the page in Playwright (headless Chromium)
3. Assert: document.title, meta[name=description].content, og tags, JSON-LD script content
4. For SSR: assert tags are in the initial HTML string (not injected by JS)
```

### Snapshot Tests

Snapshot tests for complete HTML output of common configurations (article page, product page, homepage, multilingual page). Snapshots are committed to git and must be updated intentionally.

### Bundle Size Tests (size-limit)

```json
// .size-limit.json
[
  { "path": "packages/core/dist/index.js",    "limit": "3 KB" },
  { "path": "packages/react/dist/index.js",   "limit": "5 KB" },
  { "path": "packages/next/dist/index.js",    "limit": "2 KB" }
]
```

---

## 23. CI/CD Pipeline

### `.github/workflows/ci.yml`

Runs on every push and pull request:

```yaml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint            # ESLint + TypeScript check
      - run: pnpm type-check      # tsc --noEmit across all packages

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test            # Vitest across all packages
      - run: pnpm test:integration # Playwright integration tests

  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm size            # size-limit check
```

### `.github/workflows/release.yml`

Runs on push to `main`:

```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, registry-url: 'https://registry.npmjs.org' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish -r
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 24. Publishing & Versioning

- **Monorepo versioning:** [Changesets](https://github.com/changesets/changesets)
- **Strategy:** All packages versioned independently. `meta-tags` (core) uses semver strictly. Adapters (`meta-tags/react`, etc.) version in lockstep with core for simplicity in v1.

**Release flow:**
1. Dev creates feature branch → opens PR
2. PR must include a changeset file (`pnpm changeset`)
3. CI passes (lint + tests + size check)
4. Merge to `main` → Changesets Action opens a "Version Packages" PR
5. Merge the version PR → CI publishes all changed packages to npm

**Semver commitment:**
- MAJOR: breaking API changes (prop renames, removed exports)
- MINOR: new adapters, new schema types, new features
- PATCH: bug fixes, validation rule additions, documentation

---

## 25. Competitive Analysis

| Feature | react-helmet-async | next-seo | @vercel/metadata | **meta-tags** |
|---|---|---|---|---|
| React 18 Concurrent | ✗ | ✅ | ✅ | ✅ |
| SSR streaming safe | ✗ | N/A | ✅ | ✅ |
| Next.js App Router | ✗ | Partial | ✅ | ✅ |
| Next.js Pages Router | ✅ | ✅ | N/A | ✅ |
| Remix | ✗ | ✗ | ✗ | ✅ |
| Astro | ✗ | ✗ | ✗ | ✅ |
| SvelteKit | ✗ | ✗ | ✗ | ✅ |
| Vanilla JS | ✗ | ✗ | ✗ | ✅ |
| Auto OG from title/desc | ✗ | ✗ | ✗ | ✅ |
| Auto Twitter from OG | ✗ | ✗ | ✗ | ✅ |
| JSON-LD schemas | ✗ | 5 schemas | ✗ | 12 schemas |
| OG image generation | ✗ | ✗ | ✗ | ✅ |
| Sitemap builder | ✗ | ✗ | ✗ | ✅ |
| robots.txt builder | ✗ | ✗ | ✗ | ✅ |
| PWA meta tags | ✗ | ✗ | ✗ | ✅ |
| Security meta tags | ✗ | ✗ | ✗ | ✅ |
| Resource hints | ✗ | ✗ | ✗ | ✅ |
| hreflang / i18n | ✗ | ✅ | ✅ | ✅ |
| Environment noindex | ✗ | ✗ | ✗ | ✅ |
| Dev-mode validation | ✗ | ✗ | ✗ | ✅ |
| CLI audit tool | ✗ | ✗ | ✗ | ✅ |
| Tag cascade / inheritance | ✗ | ✗ | ✗ | ✅ |
| TypeScript-first | Partial | ✅ | ✅ | ✅ Full |
| Bundle (min+gz) | ~13KB | ~10KB | N/A | **< 5KB core** |
| MIT License | ✅ | ✅ | N/A | ✅ |

---

## 26. Implementation Phases

### Phase 1 — Core Package (Week 1–2)
- [ ] Turborepo + pnpm workspace setup
- [ ] `packages/core/src/types.ts` — all TypeScript interfaces (complete)
- [ ] `packages/core/src/builder.ts` — MetaTagBuilder class
- [ ] `packages/core/src/dedup.ts` — deduplication by tag key
- [ ] `packages/core/src/derive.ts` — auto-derivation (OG ← title, Twitter ← OG)
- [ ] `packages/core/src/cascade.ts` — 4-level merge
- [ ] `packages/core/src/env.ts` — environment detection + noindex injection
- [ ] `packages/core/src/validator.ts` — all 14 validation rules
- [ ] `packages/core/src/schemas/` — all 12 JSON-LD schema builders
- [ ] Unit tests for all above
- [ ] `tsup` build config: ESM + CJS + `.d.ts`

### Phase 2 — React Adapter (Week 2–3)
- [ ] `MetaTagsProvider` + context + HeadManager
- [ ] `<MetaTags>` component (client-side `document.head` injection)
- [ ] `<MetaTags>` SSR path (renderToStaticMarkup collection)
- [ ] `useMetaTags()` hook
- [ ] `<JsonLd>` component
- [ ] `HeadManager.flush()` for SSR string output
- [ ] React 18 Concurrent Mode safety (`useSyncExternalStore`)
- [ ] SSR test suite (renderToString assertions)
- [ ] Hydration test (no tag duplication client-side)

### Phase 3 — Next.js Adapter (Week 3)
- [ ] `buildMetadata()` → returns `Metadata` type (App Router)
- [ ] `<JsonLd>` server component (App Router)
- [ ] Pages Router integration (re-uses React adapter)
- [ ] `buildSitemap()` → returns `MetadataRoute.Sitemap`
- [ ] `buildRobots()` → returns `MetadataRoute.Robots`
- [ ] Integration tests: App Router build + Playwright

### Phase 4 — Other Adapters (Week 4)
- [ ] `meta-tags/remix` — `buildMeta()` returning `MetaDescriptor[]`
- [ ] `meta-tags/astro` — `.astro` component using Astro's `<head>` slot
- [ ] `meta-tags/svelte` — `.svelte` component using `<svelte:head>`
- [ ] Integration tests for each adapter

### Phase 5 — OG Image + Sitemap Packages (Week 5)
- [ ] `meta-tags/og` — OgImage + 3 built-in templates
- [ ] `meta-tags/sitemap` — `buildSitemap().toXML()` and `buildRobots().toText()`
- [ ] Edge Runtime compatibility test

### Phase 6 — CLI (Week 6)
- [ ] `npx meta-tags init` — interactive wizard
- [ ] `npx meta-tags audit` — route scanner + reporter
- [ ] `npx meta-tags validate <url>` — live URL checker
- [ ] `npx meta-tags sitemap` and `npx meta-tags robots` — file generators
- [ ] `meta-tags.config.ts` config file support

### Phase 7 — DX Polish & Launch (Week 7)
- [ ] Dev-mode validation integrated into React + Next.js adapters
- [ ] size-limit config + CI check
- [ ] GitHub Actions: CI + release workflows
- [ ] Changesets setup
- [ ] Playground (Vite + React, auto-deployed to StackBlitz)
- [ ] Docs site (Astro + Starlight, deployed to GitHub Pages or Vercel)
- [ ] npm README (see Section 28)
- [ ] `npm publish` under `meta-tags` or `@dqev/meta-tags`

---

## 27. package.json Reference

```json
{
  "name": "meta-tags",
  "version": "0.1.0",
  "description": "Universal SEO meta tag management for React, Next.js, Remix, Astro, SvelteKit and more. One API, every framework.",
  "author": "Dev Chauhan <dev@devchauhan.in> (https://devchauhan.in)",
  "license": "MIT",
  "homepage": "https://github.com/dqev/meta-tags#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/dqev/meta-tags.git"
  },
  "bugs": { "url": "https://github.com/dqev/meta-tags/issues" },
  "keywords": [
    "seo", "meta tags", "open graph", "twitter card", "json-ld",
    "structured data", "react", "next.js", "nextjs", "remix",
    "astro", "svelte", "sveltekit", "canonical", "sitemap",
    "robots", "hreflang", "pwa", "og image", "schema.org"
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs",
      "types": "./dist/react/index.d.ts"
    },
    "./next": {
      "import": "./dist/next/index.js",
      "require": "./dist/next/index.cjs",
      "types": "./dist/next/index.d.ts"
    },
    "./remix": {
      "import": "./dist/remix/index.js",
      "types": "./dist/remix/index.d.ts"
    },
    "./astro": "./dist/astro/MetaTags.astro",
    "./svelte": "./dist/svelte/MetaTags.svelte",
    "./og": {
      "import": "./dist/og/index.js",
      "types": "./dist/og/index.d.ts"
    },
    "./sitemap": {
      "import": "./dist/sitemap/index.js",
      "require": "./dist/sitemap/index.cjs",
      "types": "./dist/sitemap/index.d.ts"
    }
  },
  "bin": { "meta-tags": "./dist/cli/index.js" },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "next": ">=13.0.0",
    "@remix-run/react": ">=2.0.0",
    "svelte": ">=4.0.0",
    "astro": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "react-dom": { "optional": true },
    "next": { "optional": true },
    "@remix-run/react": { "optional": true },
    "svelte": { "optional": true },
    "astro": { "optional": true }
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vitest": "^1.6.0",
    "tsup": "^8.1.0",
    "playwright": "^1.44.0",
    "@size-limit/preset-small-lib": "^11.0.0",
    "size-limit": "^11.0.0",
    "eslint": "^9.0.0",
    "changesets": "^2.27.0"
  },
  "engines": { "node": ">=18.0.0" }
}
```

---

## 28. npm README Spec

The npm README (`packages/core/README.md`) must contain, in order:

1. **Header badge row:** npm version · bundle size · license · TypeScript · PRs welcome
2. **One-line description**
3. **Framework logos:** React · Next.js · Remix · Astro · SvelteKit (SVG icon row)
4. **The 30-second pitch:** 3-sentence problem → solution
5. **Quick start:** `pnpm add meta-tags` + 5-line example
6. **Feature table** (from Section 25)
7. **Framework examples** (copy-paste for each, with tabs)
8. **JSON-LD schemas list** with links to docs
9. **CLI commands** overview
10. **Dev-mode warnings** screenshot / code block
11. **Bundle size table**
12. **Contributing** link → `CONTRIBUTING.md`
13. **License**
14. **Author footer:** Dev Chauhan · devchauhan.in · @devchauhann3

---

*Built by [Dev Chauhan](https://devchauhan.in) · [@devchauhann3](https://twitter.com/devchauhann3) · [github.com/dqev](https://github.com/dqev)*
