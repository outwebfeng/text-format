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
        {/* 为了提高性能添加优先级提示 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* 内联关键CSS以加快渲染速度 */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #020d24; margin: 0; padding: 0; }
          header { background-color: #020d24; }
          .h-8 { height: 2rem; }
          .w-auto { width: auto; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .font-bold { font-weight: 700; }
          .mb-4 { margin-bottom: 1rem; }
          .text-white { color: #fff; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .text-[#7c8aaa] { color: #7c8aaa; }
        `}} />
        
        {/* 增加DNS预解析和预连接以加快资源加载速度 */}
        <link rel="dns-prefetch" href="https://images.text-format.com" />
        <link rel="preconnect" href="https://images.text-format.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 预加载关键静态资源 - logo和主要内容图片 */}
        <link rel="preload" href="https://images.text-format.com/webui.svg" as="image" fetchPriority="high" />
        
        {/* 启用浏览器的资源提示功能 */}
        <meta http-equiv="x-dns-prefetch-control" content="on" />

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
