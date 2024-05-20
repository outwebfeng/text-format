import {unstable_setRequestLocale} from 'next-intl/server';

import PageComponent from './PageComponent';
import {getIndexLanguageText, getTextCleanText, getPrivacyPolicyLanguageText} from "~/configs/languageText";

export default async function PageContent({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const textCleanText = await getTextCleanText();
  const privacyPolicyLanguageText = await getPrivacyPolicyLanguageText();

  return (
    <PageComponent
      locale={locale}
      privacyPolicyLanguageText={privacyPolicyLanguageText}
      indexLanguageText={indexLanguageText}
      textCleanText={textCleanText}
    >
    </PageComponent>
  )
}
