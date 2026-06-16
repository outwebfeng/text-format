import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

import { loadEnvFiles } from './src/lib/env';

// Populate process.env from .env.local / .env.{NODE_ENV} / .env for the
// dev server and build process. In production, env comes from the actual
// host/container environment.
loadEnvFiles();

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      cookieName: 'PARAGLIDE_LOCALE',
      strategy: ['url', 'cookie', 'baseLocale'],
      urlPatterns: [
        // API endpoints are never locale-prefixed.
        {
          pattern: '/api/:path(.*)?',
          localized: [
            ['en', '/api/:path(.*)?'],
            ['zh', '/api/:path(.*)?'],
            ['ko', '/api/:path(.*)?'],
            ['ja', '/api/:path(.*)?'],
            ['de', '/api/:path(.*)?'],
            ['ar', '/api/:path(.*)?'],
          ],
        },
        {
          pattern: '/robots.txt',
          localized: [
            ['en', '/robots.txt'],
            ['zh', '/robots.txt'],
            ['ko', '/robots.txt'],
            ['ja', '/robots.txt'],
            ['de', '/robots.txt'],
            ['ar', '/robots.txt'],
          ],
        },
        {
          pattern: '/sitemap.xml',
          localized: [
            ['en', '/sitemap.xml'],
            ['zh', '/sitemap.xml'],
            ['ko', '/sitemap.xml'],
            ['ja', '/sitemap.xml'],
            ['de', '/sitemap.xml'],
            ['ar', '/sitemap.xml'],
          ],
        },
        {
          pattern: '/ads.txt',
          localized: [
            ['en', '/ads.txt'],
            ['zh', '/ads.txt'],
            ['ko', '/ads.txt'],
            ['ja', '/ads.txt'],
            ['de', '/ads.txt'],
            ['ar', '/ads.txt'],
          ],
        },
        // Bare locale homes match without a trailing-slash redirect.
        {
          pattern: '/',
          localized: [
            ['zh', '/zh'],
            ['ko', '/ko'],
            ['ja', '/ja'],
            ['de', '/de'],
            ['ar', '/ar'],
            ['en', '/'],
          ],
        },
        // "as-needed" prefix: non-English locales are prefixed, en is not.
        {
          pattern: '/:path(.*)?',
          localized: [
            ['zh', '/zh/:path(.*)?'],
            ['ko', '/ko/:path(.*)?'],
            ['ja', '/ja/:path(.*)?'],
            ['de', '/de/:path(.*)?'],
            ['ar', '/ar/:path(.*)?'],
            ['en', '/:path(.*)?'],
          ],
        },
      ],
    }),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    nitro({
      cloudflare: {
        wrangler: {
          name: 'text-format',
          vars: {
            VITE_APP_URL: 'https://text-format.com',
            VITE_APP_NAME: 'Text-Format',
            VITE_APP_DESCRIPTION:
              'Text-format is text format cleaner online tool,text cleaner,format text online,text format remover,strip HTML,remove characters,replace online.',
            VITE_DEFAULT_LOCALE: 'en',
            VITE_GOOGLE_ADSENSE_CLIENT_ID: 'ca-pub-7741547389250990',
          },
        },
      },
    }),
  ],
});
