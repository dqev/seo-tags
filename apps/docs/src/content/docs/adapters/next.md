---
title: "Next.js Adapter"
---


`meta-tags/next` maps configurations to Next.js App Router metadata structure.

## Setup
```ts
import { buildMetadata } from 'meta-tags/next';

export const metadata = buildMetadata({
  title: 'My Page',
  description: 'Page description',
});
```

