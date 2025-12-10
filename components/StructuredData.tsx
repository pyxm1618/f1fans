import React from 'react';
import { useLocation } from 'react-router-dom';

const StructuredData: React.FC = () => {
  const location = useLocation();
  const canonicalUrl = `https://f1fans.cn${location.pathname === '/' ? '' : location.pathname}`;

  // Organization Schema (Brand)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '极速F1',
    url: 'https://f1fans.cn',
    logo: 'https://f1fans.cn/og-image.jpg',
    sameAs: [
      'https://github.com/pyxm1618/f1fans',
      'https://twitter.com/f1fans_cn'
    ]
  };

  // WebSite Schema (Search Box)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '极速F1',
    url: 'https://f1fans.cn',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://f1fans.cn/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // WebPage Schema
  // Note: document.title might be updated by useSEO effect, so this might be initial state.
  // However, for prerendering, this runs on server where useSEO should have run or we rely on static generation logic.
  // Ideally, useSEO should manage this too, but a separate component is also fine for global schemas.
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};

export default StructuredData;
