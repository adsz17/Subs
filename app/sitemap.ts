import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'https://example.com';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/servicios`, lastModified: new Date() }
  ];
}
