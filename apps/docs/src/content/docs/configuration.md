---
title: "Configuration Guide"
description: "How to configure your meta tags using defineConfig"
---

`meta-tags` relies on a unified, type-safe schema to define metadata.

## Zero Config Setup

```tsx
import { MetaTags } from 'meta-tags/react';

// Outputs over 15 correct tags including canonical, Open Graph, and Twitter Cards!
<MetaTags
  title="My Page"
  description="This is my website description."
  canonical="https://example.com"
/>
```

## Config Schema

Create a `meta-tags.config.ts` file in the root of your project:

```ts
import { defineConfig } from 'meta-tags';

export default defineConfig({
  siteName: 'My Brand',
  baseUrl: 'https://example.com',
  titleTemplate: '%s | My Brand',
  defaultOgImage: '/og-default.png',
  twitter: { site: '@brand' },
  robots: { index: true, follow: true },
  env: {
    noindexOn: ['staging', 'preview'],
  },
});
```

### Options Reference

* `title`: Page title string.
* `titleTemplate`: Appends brand titles (e.g. `%s | Brand`).
* `description`: Page summary meta.
* `canonical`: Canonical path URL.
* `robots`: Index/Follow directives (accepts a string or a custom rules object).
* `og`: Open Graph options object.
* `twitter`: Twitter Card configurations.
