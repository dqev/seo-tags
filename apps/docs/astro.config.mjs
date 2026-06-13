import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'meta-tags',
      social: {
        github: 'https://github.com/dqev/meta-tags',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Configuration', link: '/configuration' },
            { label: 'CLI Tool', link: '/cli' },
          ],
        },
        {
          label: 'Framework Adapters',
          items: [
            { label: 'React & Vite', link: '/adapters/react' },
            { label: 'Next.js App Router', link: '/adapters/next' },
            { label: 'Remix v2', link: '/adapters/remix' },
            { label: 'Astro Component', link: '/adapters/astro' },
            { label: 'Svelte Adapter', link: '/adapters/svelte' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'JSON-LD Schemas', link: '/advanced/json-ld' },
            { label: 'Sitemap & Robots', link: '/advanced/sitemaps' },
            { label: 'OG Image Generation', link: '/advanced/og-images' },
          ],
        },
      ],
    }),
  ],
});
