import { absoluteLocalizedUrl, languageOptions, normalizePath } from './site';
import { t } from './messages';

type HeadResult = {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
};

export function makeSeoHead({
  namespace,
  path,
  locale,
}: {
  namespace: string;
  path: string;
  locale: string;
}): HeadResult {
  const cleanPath = normalizePath(path);
  return {
    meta: [
      { title: t(`${namespace}.title`, locale) },
      { name: 'description', content: t(`${namespace}.description`, locale) },
      { name: 'keywords', content: t(`${namespace}.keywords`, locale) },
    ],
    links: [
      ...languageOptions.map((item) => ({
        rel: 'alternate',
        hrefLang: item.lang === 'en' ? 'x-default' : item.code,
        href: absoluteLocalizedUrl(cleanPath, item.lang),
      })),
      {
        rel: 'canonical',
        href: absoluteLocalizedUrl(cleanPath, locale),
      },
    ],
  };
}
