import { localizedPath } from '@/lib/text-format/site';
import { t } from '@/lib/text-format/messages';

export function SiteFooter({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-[#d8e4dc] bg-[#fffdf8]" aria-labelledby="footer-heading">
      <div id="footer-heading" className="sr-only">
        Footer
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <p className="max-w-xl text-sm leading-6 text-[#5c6d63]">{t('IndexPage.description', locale)}</p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div />
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div />
              <div className="mt-10 md:mt-0">
                <div className="text-sm font-bold leading-6 text-[#17221d]">Legal</div>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href={localizedPath('/privacy-policy', locale)}
                      className="text-sm font-medium leading-6 text-[#5c6d63] hover:text-[#2f936a]"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href={localizedPath('/terms-of-service', locale)}
                      className="text-sm font-medium leading-6 text-[#5c6d63] hover:text-[#2f936a]"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
