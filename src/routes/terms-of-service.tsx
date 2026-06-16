import { createFileRoute } from '@tanstack/react-router';

import { LegalPage } from '@/components/text-format/legal-page';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/terms-of-service')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'termsOfService', path: '/terms-of-service', locale: loaderData?.locale ?? 'en' }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  const { locale } = Route.useLoaderData();
  return <LegalPage locale={locale} currentPath="/terms-of-service" namespace="termsOfService" />;
}
