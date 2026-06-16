import { createFileRoute } from '@tanstack/react-router';

import { LegalPage } from '@/components/text-format/legal-page';
import { makeSeoHead } from '@/lib/text-format/seo';
import { getLocale } from '@/paraglide/runtime.js';

export const Route = createFileRoute('/privacy-policy')({
  loader: () => ({ locale: getLocale() }),
  head: ({ loaderData }) =>
    makeSeoHead({ namespace: 'privacyPolicy', path: '/privacy-policy', locale: loaderData?.locale ?? 'en' }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { locale } = Route.useLoaderData();
  return <LegalPage locale={locale} currentPath="/privacy-policy" namespace="privacyPolicy" />;
}

