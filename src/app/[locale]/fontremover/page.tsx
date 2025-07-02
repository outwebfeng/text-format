import FontRemoverComponent from "./FontRemoverComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getFontRemoverText} from "~/configs/languageText";


export default async function FontRemoverPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const fontRemoverText = await getFontRemoverText();

  return (
    <FontRemoverComponent
      locale={locale}
      indexLanguageText={indexLanguageText}
      fontRemoverText={fontRemoverText}
    >
    </FontRemoverComponent>
  )
} 