import { createFileRoute } from '@tanstack/react-router';

import { StandardInfoSections } from '@/components/text-format/content-sections';
import { ToolLayout } from '@/components/text-format/layout';
import { FormatHtmlTool } from '@/components/text-format/tools';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/formathtmlonline')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'formatHtml', path: '/formathtmlonline', locale: loaderData?.locale ?? 'en' }),
  component: FormatHtmlPage,
});

function FormatHtmlPage() {
  const { locale } = Route.useLoaderData();
  return (
    <ToolLayout locale={locale} currentPath="/formathtmlonline" namespace="formatHtml" showFixedAd>
      <FormatHtmlTool />
      <StandardInfoSections namespace="formatHtml" featureCount={5} />
    </ToolLayout>
  );
}
