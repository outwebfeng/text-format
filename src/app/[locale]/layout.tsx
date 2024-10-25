import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '~/config';
import { CommonProvider } from '~/context/common-context';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Get Google Analytics ID from environment variables
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  // Adsterra广告脚本URL
  const adsterraScriptUrl = '//pl24803035.profitablecpmrate.com/10/eb/65/10eb6577bb5a8e557e3688d369c63fbd.js';

  return (
    <html className="h-full" lang={locale}>
      <head>
        {googleAnalyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        {/* Adsterra广告脚本 */}
        <Script src={adsterraScriptUrl} strategy="lazyOnload" />
      </head>
      <body suppressHydrationWarning={true} className={clsx(inter.className, 'flex h-full flex-col bg-[#020d24]')}>
        <CommonProvider>
          {children}
        </CommonProvider>
      </body>
    </html>
  );
}
