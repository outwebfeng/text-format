import { createFileRoute } from '@tanstack/react-router';

import { StandardInfoSections } from '@/components/text-format/content-sections';
import { ToolLayout } from '@/components/text-format/layout';
import { RemoveDuplicatesTool } from '@/components/text-format/tools';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/removeduplicates')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'removeDuplicates', path: '/removeduplicates', locale: loaderData?.locale ?? 'en' }),
  component: RemoveDuplicatesPage,
});

function RemoveDuplicatesPage() {
  const { locale } = Route.useLoaderData();
  return (
    <ToolLayout locale={locale} currentPath="/removeduplicates" namespace="removeDuplicates" showFixedAd>
      <RemoveDuplicatesTool />
      <StandardInfoSections namespace="removeDuplicates" featureCount={6} includeHowTo includeUseCases />
    </ToolLayout>
  );
}
