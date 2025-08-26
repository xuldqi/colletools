import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface StructuredDataProps {
  type?: 'WebSite' | 'WebPage' | 'SoftwareApplication' | 'Organization';
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'WebSite', data = {} }) => {
  const { t } = useTranslation();
  
  const getStructuredData = () => {
    const baseUrl = 'https://colletools.com';
    
    switch (type) {
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ColleTools',
          alternateName: 'ColleTools - Free Online Tools',
          url: baseUrl,
          description: t('seo.defaultDescription', 'Free online tools for PDF, image, video processing and more. Convert, compress, merge files easily.'),
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
          sameAs: [
            'https://twitter.com/colletools',
            'https://github.com/colletools'
          ],
          ...data
        };
        
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ColleTools',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description: t('seo.defaultDescription'),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'support@colletools.com'
          },
          sameAs: [
            'https://twitter.com/colletools',
            'https://github.com/colletools'
          ],
          ...data
        };
        
      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'ColleTools',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          url: baseUrl,
          description: t('seo.defaultDescription'),
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250'
          },
          ...data
        };
        
      case 'WebPage':
      default:
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.name || 'ColleTools',
          url: data.url || baseUrl,
          description: data.description || t('seo.defaultDescription'),
          isPartOf: {
            '@type': 'WebSite',
            name: 'ColleTools',
            url: baseUrl
          },
          ...data
        };
    }
  };
  
  const structuredData = getStructuredData();
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

export default StructuredData;