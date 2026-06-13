---
title: "Remix Adapter"
---


`meta-tags/remix` maps configurations to Remix v2 MetaDescriptor lists.

## Setup
```tsx
import { buildMeta } from 'meta-tags/remix';

export function meta() {
  return buildMeta({
    title: 'My Page',
    description: 'Page description',
  });
}
```

