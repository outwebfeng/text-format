import DeleteFormatComponent from "./DeleteFormatComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getDeleteFormatText} from "~/configs/languageText";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

// 生成元数据函数
export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  // 获取翻译文本
  const deleteFormatText = await getDeleteFormatText();

  // 根据语言扩展描述
  let extendedDescription = deleteFormatText.description;
  if (locale === 'zh') {
    extendedDescription = `${deleteFormatText.description} 该工具可以轻松去除文本中的多余空格、换行符和特殊格式字符，为您提供干净整洁的纯文本内容。适用于文档处理、数据清理和内容编辑，让您的文本更加易读和规范。`;
  }
  
  return {
    title: deleteFormatText.title,
    description: extendedDescription,
    keywords: deleteFormatText.keywords || "删除格式,清除文本格式,去除空格,去除换行,在线工具,文本清理",
  };
}

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