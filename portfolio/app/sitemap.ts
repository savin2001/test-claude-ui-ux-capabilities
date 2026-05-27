import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://savin-osuka.netlify.app',
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ]
}
