import FormatHtmlComponent from "./FormatHtmlComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getFormatHtmlText} from "~/configs/languageText";

export default async function FormatHtmlPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const formatHtmlText = await getFormatHtmlText();

  return (
    <FormatHtmlComponent
      locale={locale}
      indexLanguageText={indexLanguageText}
      formatHtmlText={formatHtmlText}
    >
    </FormatHtmlComponent>
  )
} 