---
title: "Sitemaps & Robots"
---


Compile XML sitemaps and plain text `robots.txt` rules.

## Setup
```ts
import { buildSitemap, buildRobots } from 'meta-tags/sitemap';

const sitemap = buildSitemap({
  baseUrl: 'https://example.com',
  routes: [{ path: '/', priority: 1.0 }]
}).toXML();
```

