import { m } from '@/paraglide/messages.js';

type MessageFn = (args?: Record<string, unknown>, options?: { locale?: string }) => string;

export function t(key: string, locale?: string): string {
  const fn = (m as unknown as Record<string, MessageFn>)[key];
  if (!fn) return key;
  return fn({}, locale ? { locale } : undefined);
}

export function ns(prefix: string, key: string, locale?: string): string {
  return t(`${prefix}.${key}`, locale);
}

