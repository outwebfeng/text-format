import { envConfigs } from '@/config';

export const supportedLocales = ['en', 'zh', 'ko', 'ja', 'de', 'ar'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const languageOptions: Array<{
  code: string;
  lang: SupportedLocale;
  language: string;
}> = [
  { code: 'en-US', lang: 'en', language: 'English' },
  { code: 'zh-CN', lang: 'zh', language: '简体中文' },
  { code: 'ko-KO', lang: 'ko', language: '한국어' },
  { code: 'ja-JP', lang: 'ja', language: '日本語' },
  { code: 'de-DE', lang: 'de', language: 'Deutsch' },
  { code: 'ar-AR', lang: 'ar', language: 'العربية' },
];

export const toolPages = [
  { labelKey: 'nav.text_format', path: '' },
  { labelKey: 'nav.delete_format', path: '/deleteformat' },
  { labelKey: 'nav.format_html', path: '/formathtmlonline' },
  { labelKey: 'nav.remove_duplicates', path: '/removeduplicates' },
  { labelKey: 'nav.font_remover', path: '/fontremover' },
];

export function siteUrl(): string {
  return (envConfigs.app_url || 'https://text-format.com').replace(/\/+$/, '');
}

export function normalizePath(path: string): string {
  if (!path || path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function localizedPath(path: string, locale: string): string {
  const cleanPath = normalizePath(path);
  if (locale === 'en') return cleanPath || '/';
  return `/${locale}${cleanPath}`;
}

export function absoluteLocalizedUrl(path: string, locale: string): string {
  return `${siteUrl()}${localizedPath(path, locale) === '/' ? '' : localizedPath(path, locale)}`;
}
