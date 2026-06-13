---
title: "JSON-LD Schemas"
---


`meta-tags` supports 12 structured schemas out of the box.

## Usage
```tsx
import { JsonLd } from 'meta-tags/react';

<JsonLd
  schema="Article"
  data={{
    headline: 'My Post',
    author: { name: 'Alice' },
    datePublished: '2026-06-13T00:00:00Z',
    image: 'https://example.com/banner.jpg',
    publisher: { name: 'Brand', logo: 'https://example.com/logo.png' }
  }}
/>
```

