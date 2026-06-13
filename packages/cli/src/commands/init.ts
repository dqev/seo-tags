import fs from 'fs';
import path from 'path';

/**
 * Initializes a new meta-tags.config.ts configuration file in the consumer project.
 */
export async function initCommand(): Promise<void> {
  console.log('Initializing meta-tags configuration...');
  
  const configContent = `import { defineConfig } from 'seo-tags';

export default defineConfig({
  siteName: 'My Site',
  baseUrl: 'https://example.com',
  titleTemplate: '%s | My Site',
  defaultOgImage: '/og-default.png',
  twitter: { site: '@example' },
  robots: { index: true, follow: true },
  env: { noindexOn: ['staging', 'preview'] },
});
`;

  try {
    fs.writeFileSync(path.resolve(process.cwd(), 'meta-tags.config.ts'), configContent);
    console.log('✓ Created meta-tags.config.ts configuration file successfully.');
  } catch (error: any) {
    console.error('✗ Failed to write configuration file:', error.message);
  }
}
