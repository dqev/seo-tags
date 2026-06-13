import fs from 'fs';
import path from 'path';

declare const process: any;

/**
 * Scans local project directories for routing components (Next, Remix, Astro, Svelte)
 * and audits them for basic metadata keywords (title, description, og:image, canonical).
 */
export async function auditCommand(): Promise<void> {
  console.log('Auditing project files for SEO configurations...');

  const searchDirs = ['app', 'pages', 'src/pages', 'src/routes'];
  const routesFound: string[] = [];

  for (const dir of searchDirs) {
    const fullPath = path.resolve(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      scanDir(fullPath, routesFound);
    }
  }

  if (routesFound.length === 0) {
    console.log('No matching route files discovered in standard directories (app, pages, src/pages, src/routes).');
    return;
  }

  console.log(`Discovered ${routesFound.length} files. Analyzing tags...`);
  console.log('\nFILEPATH                       TITLE   DESC    OG IMG   CANONICAL   SCORE');
  console.log('─────────────────────────────────────────────────────────────────────────');

  let warningConcerns = 0;
  let validationNotices = 0;

  for (const route of routesFound) {
    const content = fs.readFileSync(route, 'utf-8');
    const relativePath = path.relative(process.cwd(), route);

    const hasTitle = content.includes('title') || content.includes('<title') || content.includes('MetaTags');
    const hasDesc = content.includes('description') || content.includes('MetaTags');
    const hasOgImg = content.includes('og:image') || content.includes('defaultOgImage') || content.includes('MetaTags');
    const hasCanonical = content.includes('canonical') || content.includes('MetaTags');

    let score = 0;
    if (hasTitle) score += 25;
    if (hasDesc) score += 25;
    if (hasOgImg) score += 25;
    if (hasCanonical) score += 25;

    if (!hasTitle || !hasOgImg) warningConcerns++;
    if (!hasDesc || !hasCanonical) validationNotices++;

    const displayPath = relativePath.length > 30 ? `...${relativePath.slice(-27)}` : relativePath.padEnd(30);
    const titleStatus = hasTitle ? '✅' : '✗';
    const descStatus = hasDesc ? '✅' : '✗';
    const ogImgStatus = hasOgImg ? '✅' : '✗';
    const canonicalStatus = hasCanonical ? '✅' : '✗';

    console.log(`${displayPath} ${titleStatus}      ${descStatus}      ${ogImgStatus}      ${canonicalStatus}          ${score}`);
  }

  console.log('─────────────────────────────────────────────────────────────────────────');
  console.log(`AUDIT SUMMARY: ${warningConcerns} warning concerns, ${validationNotices} validation notices across ${routesFound.length} files.`);
}

function scanDir(dir: string, filesList: string[]) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.resolve(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full, filesList);
    } else if (/\.(tsx|ts|astro|svelte|jsx|js)$/.test(file)) {
      if (!file.includes('.test.') && !file.includes('.spec.') && !file.includes('config.')) {
        filesList.push(full);
      }
    }
  }
}
