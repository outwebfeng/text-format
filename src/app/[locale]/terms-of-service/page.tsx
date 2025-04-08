import {unstable_setRequestLocale} from 'next-intl/server';
import { Metadata } from 'next';

import PageComponent from './PageComponent';
import {getIndexLanguageText, getTermsOfServiceLanguageText} from "~/configs/languageText";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  },
  title: 'Terms of Service - Text Format',
  description: 'Terms of Service for Text Format'
};

export default async function PageContent({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const termsOfServiceLanguageText = await getTermsOfServiceLanguageText();

  return (
    <PageComponent
      locale={locale}
      termsOfServiceLanguageText={termsOfServiceLanguageText}
      indexLanguageText={indexLanguageText}
    >
    </PageComponent>
  )
}
