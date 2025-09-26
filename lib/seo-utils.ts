import { Metadata } from 'next';

export function generatePageMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}: {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article';
}): Metadata {
  const baseUrl = 'https://khoj-bd.com';
  const fullUrl = `${baseUrl}${url}`;
  
  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'খোঁজ',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
      locale: 'bn_BD',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
      creator: '@khoj_bd',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateArticleMetadata({
  title,
  description,
  keywords,
  image,
  url,
  publishedTime,
  modifiedTime,
  author = 'খোঁজ টিম'
}: {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Metadata {
  const baseUrl = 'https://khoj-bd.com';
  const fullUrl = `${baseUrl}${url}`;
  
  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'খোঁজ',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
      locale: 'bn_BD',
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
      creator: '@khoj_bd',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
