import React from 'react';
import { HeadManager } from './HeadManager.js';

export interface ServerMetaTagsProps {
  manager: HeadManager;
}

function renameReactProps(attributes: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(attributes)) {
    if (k === 'charset') {
      result['charSet'] = v;
    } else if (k === 'http-equiv') {
      result['httpEquiv'] = v;
    } else if (k === 'crossorigin') {
      result['crossOrigin'] = v;
    } else if (k === 'imagesrcset') {
      result['imageSrcSet'] = v;
    } else if (k === 'imagesizes') {
      result['imageSizes'] = v;
    } else {
      result[k] = v;
    }
  }
  return result;
}

/**
 * SSR component that outputs the compiled cascade tags as React elements.
 * Ideal for rendering inside the <head> of base HTML layout templates during SSR.
 */
export function ServerMetaTags({ manager }: ServerMetaTagsProps) {
  const resolved = manager.resolve();

  return (
    <>
      {resolved.map((tag, index) => {
        const { tag: Tag, attributes, content } = tag;

        // Custom keying logic
        const key = `${Tag}-${index}`;
        const reactAttrs = renameReactProps(attributes);

        if (Tag === 'title') {
          return (
            <title key={key} {...reactAttrs}>
              {content || ''}
            </title>
          );
        }

        if (Tag === 'script') {
          return (
            <script
              key={key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />
          );
        }

        // Void elements: link, meta
        const Element = Tag as any;
        return <Element key={key} {...reactAttrs} />;
      })}
    </>
  );
}
