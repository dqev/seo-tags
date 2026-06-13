import type { VideoObjectSchema } from '../types.js';

export function buildVideoSchema(data: VideoObjectSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate
  };

  if (data.duration) schema.duration = data.duration;
  if (data.contentUrl) schema.contentUrl = data.contentUrl;
  if (data.embedUrl) schema.embedUrl = data.embedUrl;

  return schema;
}
