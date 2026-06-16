/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { envConfigs } from '@/config';
import { getLocale } from '@/paraglide/runtime.js';

import '@fontsource-variable/inter';
import '@/styles/globals.css';

export const Route = createRootRoute({
  head: () => {
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'google-adsense-account', content: envConfigs.google_adsense_client_id },
      ],
      links: [
        { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'dns-prefetch', href: 'https://images.text-format.com' },
        { rel: 'preconnect', href: 'https://images.text-format.com', crossOrigin: 'anonymous' },
      ],
    };
  },
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <Outlet />
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          defer
          data-domain="text-format.com"
          src="https://app.pageview.app/js/script.js"
        />
        {envConfigs.google_analytics_id ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${envConfigs.google_analytics_id}`}
            />
            <script
              async
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${envConfigs.google_analytics_id}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="bg-[#f5f7f2] font-sans text-[#17221d] antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f7f2] px-6 text-[#17221d]">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-[#5f6f66]">Page not found</p>
      <a href="/" className="rounded-full bg-[#17221d] px-4 py-2 text-sm font-semibold text-white">
        Back to home
      </a>
    </div>
  );
}
