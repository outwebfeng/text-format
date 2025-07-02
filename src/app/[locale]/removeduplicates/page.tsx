import RemoveDuplicatesComponent from "./RemoveDuplicatesComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getRemoveDuplicatesText} from "~/configs/languageText";


export default async function RemoveDuplicatesPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const removeDuplicatesText = await getRemoveDuplicatesText();

  return (
    <RemoveDuplicatesComponent
      locale={locale}
      indexLanguageText={indexLanguageText}
      removeDuplicatesText={removeDuplicatesText}
    >
    </RemoveDuplicatesComponent>
  )
} 