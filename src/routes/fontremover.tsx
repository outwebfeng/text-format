import { createFileRoute } from '@tanstack/react-router';

import { StandardInfoSections } from '@/components/text-format/content-sections';
import { ToolLayout } from '@/components/text-format/layout';
import { FontRemoverTool } from '@/components/text-format/tools';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/fontremover')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'fontRemover', path: '/fontremover', locale: loaderData?.locale ?? 'en' }),
  component: FontRemoverPage,
});

function FontRemoverPage() {
  const { locale } = Route.useLoaderData();
  return (
    <ToolLayout locale={locale} currentPath="/fontremover" namespace="fontRemover" showFixedAd>
      <FontRemoverTool />
      <StandardInfoSections namespace="fontRemover" featureCount={6} includeHowTo includeUseCases />
    </ToolLayout>
  );
}
