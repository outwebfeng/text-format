import { createFileRoute } from '@tanstack/react-router';

import { StandardInfoSections } from '@/components/text-format/content-sections';
import { ToolLayout } from '@/components/text-format/layout';
import { DeleteFormatTool } from '@/components/text-format/tools';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/deleteformat')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'deleteFormat', path: '/deleteformat', locale: loaderData?.locale ?? 'en' }),
  component: DeleteFormatPage,
});

function DeleteFormatPage() {
  const { locale } = Route.useLoaderData();
  return (
    <ToolLayout locale={locale} currentPath="/deleteformat" namespace="deleteFormat" showFixedAd>
      <DeleteFormatTool />
      <StandardInfoSections namespace="deleteFormat" featureCount={6} />
    </ToolLayout>
  );
}
