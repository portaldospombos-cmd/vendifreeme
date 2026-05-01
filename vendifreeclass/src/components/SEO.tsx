import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export default function SEO({ title, description, canonicalUrl, ogImage }: SEOProps) {
  return (
    <Helmet>
      <title>{title} | Vendifree</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || '/og-image.png'} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
