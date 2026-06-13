import React from 'react';
import { compileTypedSchema } from 'seo-tags';

export type JsonLdProps =
  | { schema: string; data: Record<string, any> }
  | { raw: Record<string, any> };

/**
 * Component for injecting structured JSON-LD data.
 * Renders an inline script element with application/ld+json format.
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
