import { describe, it, expect } from 'vitest';
import { handleEnvironment } from '../env.js';

describe('environment noindex overrides', () => {
  it('should force noindex and strip canonical when matching currentEnv', () => {
    const config = {
      title: 'Dev Title',
      canonical: 'https://mysite.com/dev',
      robots: 'index, follow',
      env: {
        noindexOn: ['staging', 'preview'],
        currentEnv: 'staging'
      }
    };
    const processed = handleEnvironment(config);
    expect(processed.robots).toBe('noindex, nofollow');
    expect(processed.canonical).toBeUndefined();
  });

  it('should leave config untouched when currentEnv does not match', () => {
    const config = {
      title: 'Dev Title',
      canonical: 'https://mysite.com/dev',
      robots: 'index, follow',
      env: {
        noindexOn: ['staging', 'preview'],
        currentEnv: 'production'
      }
    };
    const processed = handleEnvironment(config);
    expect(processed.robots).toBe('index, follow');
    expect(processed.canonical).toBe('https://mysite.com/dev');
  });
});
