import React from 'react';
import { useMetaTags } from './useMetaTags.js';
import type { MetaTagsConfig } from 'seo-tags';

export type MetaTagsProps = MetaTagsConfig;

/**
 * Declarative component for injecting metadata properties into the document head cascade.
 */
export function MetaTags(props: MetaTagsProps) {
  // Pass all props directly to useMetaTags hook
  useMetaTags(props);
  return null;
}
