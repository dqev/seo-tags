import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateConfig } from '../validator.js';

describe('development validator rules', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it('should log error when title is missing', () => {
    validateConfig({ description: 'A desc' });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[meta-tags] ✗ title is missing')
    );
  });

  it('should log warning when title is too long', () => {
    validateConfig({
      title: 'This title is intentionally written to exceed sixty characters limit of Google indexing',
      description: 'A desc'
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('title is 87 chars (limit: 60)')
    );
  });

  it('should log error when og.image is missing', () => {
    validateConfig({ title: 'A good title' });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('og.image is missing')
    );
  });

  it('should log error when og.image is relative', () => {
    validateConfig({
      title: 'A good title',
      og: {
        image: '/relative/path/to/img.png'
      }
    });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('og.image is a relative URL')
    );
  });

  it('should log error when hreflang list is present but missing x-default', () => {
    validateConfig({
      title: 'Title',
      hreflang: [
        { lang: 'en', href: 'https://mysite.com/en' }
      ]
    });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('x-default is missing')
    );
  });
});
