---
title: "OG Image Generation"
---


Edge-compatible Open Graph images powered by `@vercel/og`.

## Setup
```ts
import { OgImage } from 'meta-tags/og';

export const runtime = 'edge';

export function GET() {
  return OgImage({
    template: 'blog',
    data: {
      title: 'Edge Generated OG Image',
      author: 'Alice'
    }
  });
}
```

