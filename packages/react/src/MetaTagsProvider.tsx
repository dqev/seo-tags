import React, { createContext, useMemo, useEffect } from 'react';
import { HeadManager } from './HeadManager.js';
import type { MetaTagsDefaults } from 'seo-tags';

export const MetaTagsContext = createContext<HeadManager | null>(null);

export interface MetaTagsProviderProps {
  defaults?: MetaTagsDefaults;
  manager?: HeadManager;
  children?: React.ReactNode;
}

/**
 * Provider component that configures default metadata variables and exposes
 * the central HeadManager workspace context to child pages and layout hooks.
 */
export function MetaTagsProvider({ defaults = {}, manager, children }: MetaTagsProviderProps) {
  const headManager = useMemo(() => manager || new HeadManager(defaults), [manager]);

  // Sync defaults if they are updated dynamically by user settings (only if manager not custom passed)
  useEffect(() => {
    if (!manager) {
      headManager.updateDefaults(defaults);
    }
  }, [defaults, headManager, manager]);

  return (
    <MetaTagsContext.Provider value={headManager}>
      {children}
    </MetaTagsContext.Provider>
  );
}
