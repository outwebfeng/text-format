import {unstable_setRequestLocale} from 'next-intl/server';
import { Metadata } from 'next';

import PageComponent from './PageComponent';
import {getIndexLanguageText, getPrivacyPolicyLanguageText} from "~/configs/languageText";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  },
  title: 'Privacy Policy - Text Format',
  description: 'Privacy Policy for Text Format'
};

export default async function PageContent({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const privacyPolicyLanguageText = await getPrivacyPolicyLanguageText();

  return (
    <PageComponent
      locale={locale}
      privacyPolicyLanguageText={privacyPolicyLanguageText}
      indexLanguageText={indexLanguageText}
    >
    </PageComponent>
  )
}
