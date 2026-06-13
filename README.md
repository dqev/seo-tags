# `meta-tags` — Universal SEO Monorepo

Welcome to the official monorepo for the `meta-tags` universal SEO library. This repository contains the core framework-agnostic engine, framework-specific adapters, edge OG image templates, XML/text sitemaps & robots builders, and helper tools.

## Repository Architecture

This project is organized as a **PNPM Workspace** managed with **Turborepo** for high-performance caching and build scheduling:

```
├── packages/
│   ├── core/                       ← meta-tags (Main entry, NPM package)
│   ├── react/                      ← React + Vite adapter
│   ├── next/                       ← Next.js adapter
│   ├── remix/                      ← Remix adapter
│   ├── astro/                      ← Astro adapter
│   ├── svelte/                     ← Svelte adapter
│   ├── og/                         ← Edge OG image generator
│   └── cli/                        ← Auditing & Crawler validator CLI
└── apps/
    ├── docs/                       ← Starlight documentation site
    └── playground/                 ← Interactive visual SERP sandbox
```

### Subpath Export Bundling
Adapter dist files are bundled and compiled into individual frameworks, then mapped to subpaths of the primary `meta-tags` package using a custom [postbuild.js](packages/core/scripts/postbuild.js) script. This allows consumers to install a single package (`meta-tags`) and import the adapters cleanly:

```ts
import { buildTags } from 'meta-tags';
import { MetaTags } from 'meta-tags/react';
import { buildMetadata } from 'meta-tags/next';
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PNPM >= 9.0.0

### Installation
Clone the repository and install the dependencies:

```bash
pnpm install
```

### Development Scripts

Run the monorepo tasks using Turborepo commands defined in the root `package.json`:

```bash
# Build all packages and assemble the subpath exports
pnpm build

# Run vitest unit and integration suites across all packages (31 tests)
pnpm test

# Run typescript compilation type-checks across all packages
pnpm type-check

# Run ESLint validation checks
pnpm lint

# Check Brotli bundle sizes against configured limits
pnpm size

# Launch documentation site and playground app in dev mode
pnpm dev
```

---

## Release Process

This monorepo uses **Changesets** for automated semver incrementation, changelog creation, and NPM publishing.

1. **Create a changeset file**:
   ```bash
   pnpm changeset
   ```
   Follow the CLI prompt to select version bump levels and summarize changes.
2. **Version Packages**:
   Merging changesets to the `main` branch automatically triggers the versioning pipeline via the Release GitHub Action.

---

## License

MIT © [Dev Chauhan](https://devchauhan.in)
