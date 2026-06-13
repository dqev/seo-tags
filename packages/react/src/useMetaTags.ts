import { useContext, useId, useEffect } from 'react';
import { MetaTagsContext } from './MetaTagsProvider.js';
import type { MetaTagsConfig } from 'seo-tags';

declare const process: any;

/**
 * Custom React hook to bind metadata configurations to the cascade.
 * Performs immediate registration for SSR, and handles client-side updates/cleanup.
 */
export function useMetaTags(config: MetaTagsConfig, deps?: any[]): void {
  const headManager = useContext(MetaTagsContext);
  const id = useId();

  if (headManager) {
    // Register immediately during render so that SSR flush catches this layer
    headManager.addConfig(id, config);
  } else {
    // Notify developer if provider is missing in dev mode
    try {
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
        console.warn(
          '[meta-tags] ⚠ MetaTags context is missing. Ensure your component tree is wrapped inside a <MetaTagsProvider>.'
        );
      }
    } catch {
      // Safe ignore
    }
  }

  useEffect(() => {
    if (!headManager) return;

    // Register/update config and flush updates to document.head
    headManager.addConfig(id, config);
    headManager.clientUpdate();

    return () => {
      headManager.removeConfig(id);
      headManager.clientUpdate();
    };
  }, deps ? [...deps, headManager, id] : [config, headManager, id]);
}
