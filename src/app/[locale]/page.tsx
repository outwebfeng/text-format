import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getTextCleanText} from "~/configs/languageText";


export default async function IndexPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const textCleanText = await getTextCleanText();

  return (
    <PageComponent
      locale={locale}
      indexLanguageText={indexLanguageText}
      textCleanText={textCleanText}
    >
    </PageComponent>
  )
}
