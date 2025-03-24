import FormatHtmlComponent from "./FormatHtmlComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getFormatHtmlText} from "~/configs/languageText";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

// 生成元数据函数
export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  // 获取翻译文本
  const formatHtmlText = await getFormatHtmlText();
  
  // 根据语言扩展描述
  let extendedDescription = formatHtmlText.description;
  if (locale === 'zh') {
    extendedDescription = `${formatHtmlText.description} 这款在线HTML格式化工具能够为您提供规范、美观的HTML代码，正确处理标签缩进和空格，使代码更易于阅读和维护。适合开发者、设计师以及任何需要处理HTML代码的用户使用，支持即时预览和复制功能。`;
  }
  
  return {
    title: formatHtmlText.title,
    description: extendedDescription,
    keywords: formatHtmlText.keywords || "HTML格式化,HTML美化,HTML格式化器,在线HTML工具,代码美化,代码缩进,HTML编辑器",
  };
}

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