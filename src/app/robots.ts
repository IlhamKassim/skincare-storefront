import type { MetadataRoute } from 'next';

const BASE_URL = 'https://skinsync-mvp.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/auth', '/api'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
