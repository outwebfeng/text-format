import PageComponent from "./PageComponent";
import {unstable_setRequestLocale} from 'next-intl/server';
import {getIndexLanguageText, getTextCleanText} from "~/configs/languageText";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

// 生成元数据函数
export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  // 获取翻译文本
  const indexLanguageText = await getIndexLanguageText();
  
  // 根据语言扩展描述
  let extendedDescription = indexLanguageText.description;
  if (locale === 'zh') {
    extendedDescription = `${indexLanguageText.description} Text-Format是一个免费的在线工具，提供各种文本处理功能，包括清理文本格式、HTML标签处理、大小写转换、空格和换行处理，以及查找替换功能，使您能够快速获得干净整洁的文本。`;
  } else if (locale === 'ko') {
    extendedDescription = `${indexLanguageText.description} Text-Format은 텍스트 형식 정리, HTML 태그 처리, 대소문자 변환, 공백 및 줄 바꿈 처리, 텍스트 찾기 및 바꾸기 기능을 포함한 다양한 텍스트 처리 기능을 제공하는 무료 온라인 도구입니다.`;
  }
  
  return {
    title: indexLanguageText.title,
    description: extendedDescription,
    keywords: indexLanguageText.keywords,
  };
}

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
