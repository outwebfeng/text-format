import { createFileRoute } from '@tanstack/react-router';

import { TextCleanHelpSection } from '@/components/text-format/content-sections';
import { ToolLayout } from '@/components/text-format/layout';
import { TextCleanTool } from '@/components/text-format/tools';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) => makeSeoHead({ namespace: 'IndexPage', path: '', locale: loaderData?.locale ?? 'en' }),
  component: HomePage,
});

function HomePage() {
  const { locale } = Route.useLoaderData();
  return (
    <ToolLayout locale={locale} currentPath="" namespace="textClean" showTopAd showFixedAd>
      <TextCleanTool />
      <TextCleanHelpSection />
    </ToolLayout>
  );
}
