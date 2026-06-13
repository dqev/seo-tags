import React from 'react';
import { compileTypedSchema } from 'seo-tags';

export type JsonLdProps =
  | { schema: string; data: Record<string, any> }
  | { raw: Record<string, any> };

/**
 * Next.js React Server Component (RSC) to render JSON-LD structured data scripts.
 * Emits raw schema structures directly into the HTML tree.
 */
export function JsonLd(props: JsonLdProps) {
  const schemaObj = 'raw' in props ? props.raw : compileTypedSchema(props.schema, props.data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
    />
  );
}
