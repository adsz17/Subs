export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
