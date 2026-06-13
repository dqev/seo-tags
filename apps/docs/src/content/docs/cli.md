---
title: "CLI Tool Reference"
---


Manage your meta configurations straight from the terminal.

## Installation
```bash
npx meta-tags --help
```

## Commands

### init
Scaffolds a standard `meta-tags.config.ts` configuration file in the project.
```bash
npx meta-tags init
```

### audit
Scans local routing folders (`app`, `pages`, `routes`) and analyzes SEO configurations.
```bash
npx meta-tags audit
```

### validate
Fetches a live URL page, parses tags, and logs SEO validation checks.
```bash
npx meta-tags validate https://example.com
```

