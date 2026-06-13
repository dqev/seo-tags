import type { MetaTagsConfig } from './types.js';

declare const process: any;

/**
 * Handles environment-aware modifications to the metadata config.
 * When the current environment is included in the noindexOn list:
 * 1. Overrides robots tag to 'noindex, nofollow'.
 * 2. Removes canonical URL to prevent staging association.
 * 3. Logs an information alert in the console.
 */
export function handleEnvironment(config: MetaTagsConfig): MetaTagsConfig {
  if (!config.env) return config;

  const { noindexOn = [], currentEnv: configEnv } = config.env;
  if (noindexOn.length === 0) return config;

  let currentEnv = configEnv;

  // Auto-detect environment if not explicitly set
  if (!currentEnv) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        currentEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || process.env.ENV;
      }
    } catch {
      // Ignored if process.env is inaccessible (e.g. static bundles)
    }
  }

  if (currentEnv && noindexOn.includes(currentEnv)) {
    const updated = { ...config };
    
    // Set robots to noindex
    updated.robots = 'noindex, nofollow';
    
    // Strip canonical to prevent search engines associating dev/staging with prod
    delete updated.canonical;

    // Log in development or preview mode (non-production environments)
    if (typeof console !== 'undefined' && currentEnv !== 'production') {
      console.info(`[meta-tags] ℹ [ENV] noindex active — environment is "${currentEnv}", which matches noindexOn config.`);
    }

    return updated;
  }

  return config;
}
