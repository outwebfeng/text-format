import DeleteFormatComponent from "./DeleteFormatComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getDeleteFormatText} from "~/configs/languageText";


export default async function DeleteFormatPage({params: {locale = ''}}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const indexLanguageText = await getIndexLanguageText();
  const deleteFormatText = await getDeleteFormatText();

  return (
    <DeleteFormatComponent
      locale={locale}
      indexLanguageText={indexLanguageText}
      deleteFormatText={deleteFormatText}
    >
    </DeleteFormatComponent>
  )
} 