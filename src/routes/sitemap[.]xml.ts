import { createFileRoute } from '@tanstack/react-router';

import { absoluteLocalizedUrl, supportedLocales } from '@/lib/text-format/site';

const STATIC_PATHS = [
  '',
  '/deleteformat',
  '/formathtmlonline',
  '/removeduplicates',
  '/fontremover',
];

type Entry = {
  path: string;
  locale: string;
  changeFrequency: string;
  priority: number;
};

function entryXml(e: Entry): string {
  return [
    '  <url>',
    `    <loc>${absoluteLocalizedUrl(e.path, e.locale)}</loc>`,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ].join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = STATIC_PATHS.flatMap((path) =>
          supportedLocales.map((locale) => ({
            path,
            locale,
            changeFrequency: 'weekly',
            priority: 0.8,
          }))
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(entryXml),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
