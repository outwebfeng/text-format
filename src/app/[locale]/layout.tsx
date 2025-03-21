import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '~/config';
import { CommonProvider } from '~/context/common-context';
import Script from 'next/script';

// 预加载字体以提高性能
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

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

  // 获取谷歌广告客户端 ID
  const googleAdsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  
  return (
    <html className="h-full" lang={locale}>
      <head>
        {/* 内联关键CSS以加快渲染速度 */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #020d24; margin: 0; padding: 0; }
          header { background-color: #020d24; }
          .h-8 { height: 2rem; }
          .w-auto { width: auto; }
        `}} />
        
        {/* 添加预连接以加快资源加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 预加载关键静态资源 */}
        <link rel="preload" href="/webui.svg" as="image" />

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
        {googleAdsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClientId}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        {googleAdsenseClientId && (<meta name="google-adsense-account" content={googleAdsenseClientId}></meta>)}
      </head>
      <body suppressHydrationWarning={true} className={clsx(inter.className, 'flex h-full flex-col bg-[#020d24]')}>
        <CommonProvider>
          {children}
        </CommonProvider>
      </body>
    </html>
  );
}
