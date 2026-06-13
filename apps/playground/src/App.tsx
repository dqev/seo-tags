import { useState, useMemo } from 'react';
import { buildTags } from 'seo-tags';

export default function App() {
  // Config form state
  const [title, setTitle] = useState('Build stunning Web Apps');
  const [titleTemplate, setTitleTemplate] = useState('%s | Antigravity AI');
  const [description, setDescription] = useState('Antigravity helps you design, build, and publish high-performance universal websites using modern frameworks and a beautiful component design system.');
  const [canonical, setCanonical] = useState('https://antigravity.dev/playground');
  const [keywords, setKeywords] = useState('seo, meta tags, react, nextjs, remix, astro, svelte');
  const [author, setAuthor] = useState('Alice');
  const [ogType, setOgType] = useState<'website' | 'article'>('website');
  const [ogImageUrl, setOgImageUrl] = useState('https://antigravity.dev/social-banner.png');
  const [ogImageAlt, setOgImageAlt] = useState('Antigravity AI Web Banner');
  const [twitterSite, setTwitterSite] = useState('@antigravity_ai');
  const [twitterCreator, setTwitterCreator] = useState('@alice_dev');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'google' | 'social' | 'html' | 'audit'>('google');

  // Build the tags configuration
  const config = useMemo(() => {
    return {
      title,
      titleTemplate,
      description,
      canonical,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
      author,
      robots: {
        index: robotsIndex,
        follow: robotsFollow,
      },
      og: {
        type: ogType,
        image: ogImageUrl ? {
          url: ogImageUrl,
          alt: ogImageAlt,
          width: 1200,
          height: 630
        } : undefined,
      },
      twitter: {
        site: twitterSite,
        creator: twitterCreator,
      }
    };
  }, [
    title, titleTemplate, description, canonical, keywords, author,
    ogType, ogImageUrl, ogImageAlt, twitterSite, twitterCreator,
    robotsIndex, robotsFollow
  ]);

  // Resolve tags
  const resolvedTags = useMemo(() => {
    try {
      return buildTags(config).resolve();
    } catch (err: any) {
      console.error(err);
      return [];
    }
  }, [config]);

  // Compute resolved title for preview
  const resolvedTitle = useMemo(() => {
    if (titleTemplate && title) {
      return titleTemplate.replace('%s', title);
    }
    return title || '';
  }, [title, titleTemplate]);

  // Run SEO validation logic reactively
  const auditLogs = useMemo(() => {
    const logs: Array<{ type: 'error' | 'warning' | 'info'; label: string; text: string }> = [];

    // Title checks
    if (!title) {
      logs.push({ type: 'error', label: 'Error', text: 'title is missing — Google requires a title tag to index pages.' });
    } else {
      const len = title.length;
      if (len > 60) {
        logs.push({ type: 'warning', label: 'Warning', text: `title is ${len} chars (limit: 60) — Google will truncate it: "${title.slice(0, 30)}..."` });
      } else if (len < 10) {
        logs.push({ type: 'warning', label: 'Warning', text: `title is ${len} chars — too short. Add context to improve click-through-rates (CTR).` });
      }
    }

    // Description checks
    if (!description) {
      logs.push({ type: 'warning', label: 'Warning', text: 'description is missing — search engines may extract random body content instead.' });
    } else {
      const len = description.length;
      if (len > 160) {
        logs.push({ type: 'warning', label: 'Warning', text: `description is ${len} chars (limit: 160) — it will be truncated in search results.` });
      } else if (len < 50) {
        logs.push({ type: 'warning', label: 'Warning', text: `description is ${len} chars — too short. Expand it to explain the page content better.` });
      }
    }

    // Canonical check
    if (!canonical) {
      logs.push({ type: 'warning', label: 'Warning', text: 'canonical URL is missing — this introduces duplicate content indexing risks.' });
    }

    // OG Image check
    if (!ogImageUrl) {
      logs.push({ type: 'error', label: 'Error', text: 'og:image is missing — social previews (LinkedIn, Slack, Twitter) will fall back to a blank card.' });
    } else if (!ogImageUrl.startsWith('http://') && !ogImageUrl.startsWith('https://')) {
      logs.push({ type: 'error', label: 'Error', text: `og:image is a relative URL "${ogImageUrl}" — crawlers cannot resolve relative paths. Use an absolute URL.` });
    } else {
      if (!ogImageAlt) {
        logs.push({ type: 'warning', label: 'Warning', text: 'og:image:alt description is missing — required for screen-readers and accessibility audits.' });
      }
    }

    // Twitter Card check
    if (!twitterSite) {
      logs.push({ type: 'warning', label: 'Warning', text: 'twitter:site is missing — specify the app/corporate twitter profile handle.' });
    }

    // Success log if clean
    if (logs.length === 0) {
      logs.push({ type: 'info', label: 'Excellent', text: 'All meta settings passed verification tests with 100% clean SEO scores!' });
    }

    return logs;
  }, [title, description, canonical, ogImageUrl, ogImageAlt, twitterSite]);

  // Convert resolved tags to HTML representation
  const htmlOutput = useMemo(() => {
    return resolvedTags.map(tag => {
      const attrsStr = Object.entries(tag.attributes)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join('');
      
      if (tag.tag === 'title') {
        return `<title>${tag.content}</title>`;
      }
      if (tag.tag === 'script') {
        return `<script type="${tag.attributes.type}">${tag.content}</script>`;
      }
      return `<${tag.tag}${attrsStr} />`;
    }).join('\n');
  }, [resolvedTags]);

  const cleanUrlDomain = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      return parsed.hostname;
    } catch {
      return 'example.com';
    }
  };

  return (
    <div className="playground-container">
      {/* Header */}
      <header className="playground-header">
        <div className="header-title-container">
          <div className="header-logo">M</div>
          <h1 className="header-title">meta-tags playground</h1>
          <span className="header-badge">v0.1.0</span>
        </div>
        <div>
          <a
            href="https://github.com/dqev/meta-tags"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Grid */}
      <main className="playground-main">
        {/* Sidebar Inputs */}
        <section className="editor-panel">
          <div>
            <h3 className="panel-section-title">Page Identity</h3>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Title Template</label>
              <input
                type="text"
                className="form-input"
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Keywords</label>
                <input
                  type="text"
                  className="form-input"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Canonical URL</label>
              <input
                type="text"
                className="form-input"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="panel-section-title">Social (Open Graph)</h3>
            <div className="form-group">
              <label className="form-label">OG Type</label>
              <select
                className="form-select"
                value={ogType}
                onChange={(e) => setOgType(e.target.value as any)}
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">OG Image URL</label>
              <input
                type="text"
                className="form-input"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">OG Image Alt</label>
              <input
                type="text"
                className="form-input"
                value={ogImageAlt}
                onChange={(e) => setOgImageAlt(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="panel-section-title">Twitter Cards</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Site handle</label>
                <input
                  type="text"
                  className="form-input"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Creator handle</label>
                <input
                  type="text"
                  className="form-input"
                  value={twitterCreator}
                  onChange={(e) => setTwitterCreator(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="panel-section-title">Robots directives</h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-color)' }}
                />
                Index
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                  style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-color)' }}
                />
                Follow
              </label>
            </div>
          </div>
        </section>

        {/* Right Preview Area */}
        <section className="preview-panel">
          {/* Tab Selection */}
          <nav className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'google' ? 'active' : ''}`}
              onClick={() => setActiveTab('google')}
            >
              🔍 Google SERP
            </button>
            <button
              className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              👥 Social Previews
            </button>
            <button
              className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              💻 Generated HTML
            </button>
            <button
              className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
              style={{ position: 'relative' }}
            >
              🚨 SEO Auditor
              {auditLogs.some(l => l.type === 'error' || l.type === 'warning') && (
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.125rem',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-error)'
                }} />
              )}
            </button>
          </nav>

          {/* Tab Contents */}
          <div className="tabs-content">
            {activeTab === 'google' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 className="preview-subtitle">Google Search Result Preview</h4>
                <div className="google-preview-card">
                  <div className="google-url">
                    {canonical || 'https://example.com'}
                    <span style={{ fontSize: '10px', color: '#5f6368' }}>▼</span>
                  </div>
                  <div className="google-title">{resolvedTitle}</div>
                  <div className="google-desc">
                    {description || 'Provide a description to see the search snippet preview...'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="social-preview-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 className="preview-subtitle">Facebook / Open Graph Share Card</h4>
                  <div className="social-card">
                    {ogImageUrl ? (
                      <img src={ogImageUrl} alt={ogImageAlt} className="social-img" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }} />
                    ) : (
                      <div className="social-img-placeholder">
                        <span>No image provided</span>
                      </div>
                    )}
                    <div className="social-body">
                      <div className="social-domain">{cleanUrlDomain(canonical)}</div>
                      <div className="social-title">{title || resolvedTitle}</div>
                      <div className="social-desc">{description}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 className="preview-subtitle">Twitter Card (Summary Large Image)</h4>
                  <div className="social-card">
                    {ogImageUrl ? (
                      <img src={ogImageUrl} alt={ogImageAlt} className="social-img" />
                    ) : (
                      <div className="social-img-placeholder">
                        <span>No image provided</span>
                      </div>
                    )}
                    <div className="social-body">
                      <div className="social-domain">{cleanUrlDomain(canonical)}</div>
                      <div className="social-title">{title || resolvedTitle}</div>
                      <div className="social-desc">{description}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'html' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 className="preview-subtitle">HTML Head Tags Output</h4>
                <pre className="tags-code-block">{htmlOutput}</pre>
              </div>
            )}

            {activeTab === 'audit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 className="preview-subtitle">Live Crawler SEO Audit Logs</h4>
                <div className="audit-list">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className={`audit-item ${log.type}`}>
                      <div className="audit-icon">
                        {log.type === 'error' ? '🔴' : log.type === 'warning' ? '🟡' : '🟢'}
                      </div>
                      <div className="audit-body">
                        <span className={`audit-label ${log.type}`}>{log.label}</span>
                        <span>{log.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
