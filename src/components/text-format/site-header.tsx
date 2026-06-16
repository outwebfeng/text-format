import { Link } from '@tanstack/react-router';
import { Menu, X, Globe, Github } from 'lucide-react';
import { useState } from 'react';

import { t } from '@/lib/text-format/messages';
import { languageOptions, localizedPath, toolPages } from '@/lib/text-format/site';

export function SiteHeader({
  locale,
  currentPath,
}: {
  locale: string;
  currentPath: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePath = currentPath || '';
  const isActive = (path: string) => path === activePath;

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#dde6dd] bg-[#fffdf8]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="flex items-center rounded-full p-1.5 text-[#17221d]" aria-label="Text-Format">
            <img className="h-auto w-24 shrink-0 sm:w-32" src="/webui.svg" width={128} height={29} alt="text-format.com" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e2db] bg-white text-[#17221d] shadow-sm lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open main menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="hidden rounded-full border border-[#dce7df] bg-white/80 p-1 shadow-sm lg:flex lg:gap-x-1">
          {toolPages.map((item) => (
            <Link
              key={item.path || 'home'}
              to={item.path || '/'}
              className={`rounded-full px-4 py-2 text-sm font-semibold leading-5 transition ${
                isActive(item.path)
                  ? 'bg-[#17221d] text-white shadow-sm'
                  : 'text-[#4f6258] hover:bg-[#edf4ef] hover:text-[#17221d]'
              }`}
            >
              {t(item.labelKey, locale)}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:mr-2">
          <a
            href="https://github.com/outwebfeng/text-format"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e2db] bg-white text-[#506259] shadow-sm transition hover:border-[#9ccfb9] hover:text-[#17221d]"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>

        <div className="relative ml-3">
          <details className="group">
            <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-x-1.5 rounded-full border border-[#d7e2db] bg-white px-3 text-sm font-semibold text-[#17221d] shadow-sm transition hover:border-[#9ccfb9]">
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-36 overflow-hidden rounded-lg border border-[#dce7df] bg-white py-1 shadow-xl shadow-[#0f2b1e1a]">
              {languageOptions.map((item) => (
                <a
                  key={item.lang}
                  href={localizedPath(currentPath, item.lang)}
                  className="block px-4 py-2 text-sm font-medium text-[#506259] transition hover:bg-[#edf4ef] hover:text-[#17221d]"
                >
                  {item.language}
                </a>
              ))}
            </div>
          </details>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto border-l border-[#dce7df] bg-[#fffdf8] px-6 py-6 shadow-2xl sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center rounded-full p-1.5 text-[#17221d]" aria-label="Text-Format">
              <img className="h-auto w-32 shrink-0" src="/webui.svg" width={128} height={29} alt="text-format.com" />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e2db] bg-white text-[#17221d]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-2 py-6">
            {toolPages.map((item) => (
              <Link
                key={item.path || 'home-mobile'}
                to={item.path || '/'}
                className={`block rounded-lg px-4 py-3 text-base font-semibold leading-6 transition ${
                  isActive(item.path)
                    ? 'bg-[#17221d] text-white'
                    : 'text-[#4f6258] hover:bg-[#edf4ef] hover:text-[#17221d]'
                }`}
              >
                {t(item.labelKey, locale)}
              </Link>
            ))}
            <a
              href="https://github.com/outwebfeng/text-format"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#4f6258] transition hover:bg-[#edf4ef] hover:text-[#17221d]"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
