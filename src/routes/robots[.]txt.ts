import { createFileRoute } from '@tanstack/react-router';

import { siteUrl } from '@/lib/text-format/site';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const body = [
          'User-Agent: *',
          'Allow: *',
          '',
          '# 阻止错误的canonical URL',
          'Disallow: *canonical',
          '',
          '# 阻止特定语言组合的错误URL',
          'Disallow: /*/undefined/',
          'Disallow: /undefined/',
          '',
          'Disallow: /in/',
          'Disallow: /pk/',
          '',
          'Disallow: /*/privacy-policycanonical/',
          'Disallow: /privacy-policycanonical/',
          '',
          '',
          'Disallow: /*/privacy-policy/',
          'Disallow: /privacy-policy/',
          '',
          'Disallow: /*/terms-of-service/',
          'Disallow: /terms-of-service/',
          '',
          'Disallow: /_next/',
          '',
          '# Sitemap',
          `Sitemap: ${siteUrl()}/sitemap.xml`,
          '',
        ].join('\n');
        return new Response(body, {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});
