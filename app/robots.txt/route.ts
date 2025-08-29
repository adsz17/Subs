export async function GET() {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'https://example.com';
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
