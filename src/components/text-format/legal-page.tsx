import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

import { ns } from '@/lib/text-format/messages';

export function LegalPage({
  locale,
  currentPath,
  namespace,
}: {
  locale: string;
  currentPath: string;
  namespace: 'privacyPolicy' | 'termsOfService';
}) {
  const paragraphKeys =
    namespace === 'privacyPolicy'
      ? ['h4_1_pa', 'h4_1_pb']
      : ['h4_1_p'];

  return (
    <>
      <SiteHeader locale={locale} currentPath={currentPath} />
      <main className="bg-[#f5f7f2] px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl border-t border-[#d8e4dc] pt-10 text-[#17221d]">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{ns(namespace, 'h1')}</h1>
            <p className="text-base font-semibold text-[#3f8f6a]">{ns(namespace, 'date')}</p>
            <p className="text-lg leading-8 text-[#5c6d63]">{ns(namespace, 'desc')}</p>

            <h4 className="pt-4 text-2xl font-bold">{ns(namespace, 'h4_1')}</h4>
            {paragraphKeys.map((key) => (
              <p key={key} className="text-lg leading-8 text-[#5c6d63]">
                {ns(namespace, key)}
              </p>
            ))}

            {[2, 3, 4, 5].map((i) => (
              <section key={i} className="border-t border-[#d8e4dc] pt-6">
                <h4 className="text-2xl font-bold">{ns(namespace, `h4_${i}`)}</h4>
                <p className="mt-3 text-lg leading-8 text-[#5c6d63]">{ns(namespace, `h4_${i}_p`)}</p>
              </section>
            ))}

            <h4 className="border-t border-[#d8e4dc] pt-6 text-2xl font-bold">{ns(namespace, 'h4_6')}</h4>
            <p className="text-lg leading-8 text-[#5c6d63]">
              {ns(namespace, 'h4_6_p')}{' '}
              <a href="mailto:support@text-format.com" className="font-semibold text-[#2f936a] underline underline-offset-4">
                support@text-format.com
              </a>
              .
            </p>
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
