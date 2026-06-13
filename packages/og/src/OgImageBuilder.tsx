import React from 'react';
import { ImageResponse } from '@vercel/og';

export interface OgImageOptions {
  template: 'minimal' | 'blog' | 'product' | React.ReactElement;
  data: {
    title: string;
    description?: string;
    author?: string;
    date?: string;
    logo?: string;
    accentColor?: string;
    price?: number | string;
    currency?: string;
    image?: string;
    brand?: string;
    domain?: string;
  };
  size?: { width: number; height: number };
  fonts?: any[];
}

export function MinimalTemplate({ title, description, domain = 'example.com' }: any) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#1b1b1b',
      color: '#ffffff',
      width: '100%',
      height: '100%',
      padding: '80px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', fontSize: '24px', color: '#aaaaaa', fontWeight: 'bold', marginBottom: '20px' }}>
        {domain}
      </div>
      <h1 style={{ display: 'flex', fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.2 }}>
        {title}
      </h1>
      {description && (
        <p style={{ display: 'flex', fontSize: '28px', color: '#cccccc', margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
  );
}

export function BlogTemplate({ title, description, author, date, logo, accentColor = '#1b1b1b' }: any) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#ffffff',
      color: '#1b1b1b',
      width: '100%',
      height: '100%',
      padding: '80px',
      borderLeft: `16px solid ${accentColor}`,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {logo ? (
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        ) : (
          <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: accentColor }}>BLOG</div>
        )}
        {date && <div style={{ display: 'flex', fontSize: '20px', color: '#666666' }}>{date}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ display: 'flex', fontSize: '56px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.2 }}>
          {title}
        </h1>
        {description && (
          <p style={{ display: 'flex', fontSize: '24px', color: '#555555', margin: 0, lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', color: '#444444' }}>
        {author && <span style={{ display: 'flex' }}>By {author}</span>}
      </div>
    </div>
  );
}

export function ProductTemplate({ title, price, currency = 'USD', image, brand }: any) {
  return (
    <div style={{
      display: 'flex',
      background: '#f8f9fa',
      color: '#1b1b1b',
      width: '100%',
      height: '100%',
      padding: '60px',
      fontFamily: 'sans-serif',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '55%', justifyContent: 'center' }}>
        {brand && (
          <div style={{
            display: 'flex',
            fontSize: '18px',
            textTransform: 'uppercase',
            color: '#666666',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {brand}
          </div>
        )}
        <h1 style={{ display: 'flex', fontSize: '52px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.2 }}>
          {title}
        </h1>
        <div style={{ display: 'flex', fontSize: '36px', fontWeight: 'bold', color: '#000000' }}>
          {price !== undefined ? `${currency} ${price}` : ''}
        </div>
      </div>
      {image && (
        <div style={{ display: 'flex', width: '35%', height: '80%', overflow: 'hidden', borderRadius: '12px', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' }}>
          <img src={image} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}

/**
 * Builds an Edge Runtime-compatible ImageResponse containing one of the prebuilt OG templates.
 */
export function OgImage(options: OgImageOptions): ImageResponse {
  const { template, data, size = { width: 1200, height: 630 }, fonts } = options;

  let element: React.ReactElement;

  if (typeof template === 'string') {
    switch (template) {
      case 'minimal':
        element = <MinimalTemplate {...data} />;
        break;
      case 'blog':
        element = <BlogTemplate {...data} />;
        break;
      case 'product':
        element = <ProductTemplate {...data} />;
        break;
      default:
        element = <MinimalTemplate {...data} />;
    }
  } else {
    element = template;
  }

  return new ImageResponse(element, {
    width: size.width,
    height: size.height,
    fonts
  });
}
