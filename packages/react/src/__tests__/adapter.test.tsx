import React from 'react';
import { describe, it, expect } from 'vitest';
import ReactDOMServer from 'react-dom/server';
import { MetaTagsProvider } from '../MetaTagsProvider.js';
import { MetaTags } from '../MetaTags.js';
import { JsonLd } from '../JsonLd.js';
import { ServerMetaTags } from '../ServerMetaTags.js';
import { HeadManager } from '../HeadManager.js';

describe('React adapter components', () => {
  it('should compile context provider defaults and SSR correct tags', () => {
    const manager = new HeadManager({
      siteName: 'My Website',
      titleTemplate: '%s | My Website'
    });

    const html = ReactDOMServer.renderToStaticMarkup(
      <MetaTagsProvider manager={manager}>
        <MetaTags title="Home" description="Welcome home" />
        <ServerMetaTags manager={manager} />
      </MetaTagsProvider>
    );

    expect(html).toContain('<title>Home | My Website</title>');
    expect(html).toContain('name="description" content="Welcome home"');
    expect(html).toContain('property="og:site_name" content="My Website"');
  });

  it('should render JSON-LD script tags directly inline', () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <JsonLd schema="Person" data={{ name: 'Alice Smith' }} />
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('"name":"Alice Smith"');
  });
});
