---
title: "React Adapter"
---


`meta-tags/react` adapter works with React + Vite and Pages routers.

## Setup
```tsx
import { MetaTagsProvider, MetaTags } from 'meta-tags/react';

export default function App() {
  return (
    <MetaTagsProvider defaults={{ siteName: 'My Site' }}>
      <MetaTags title="Home" description="Welcome" />
    </MetaTagsProvider>
  );
}
```

