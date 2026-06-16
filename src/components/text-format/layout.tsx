import type { ReactNode } from 'react';

import { GoogleAd, GoogleAdFixed } from './google-ad';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

import { ns } from '@/lib/text-format/messages';

export function ToolLayout({
  locale,
  currentPath,
  namespace,
  showTopAd = false,
  showFixedAd = false,
  children,
}: {
  locale: string;
  currentPath: string;
  namespace: string;
  showTopAd?: boolean;
  showFixedAd?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} currentPath={currentPath} />
      <main className="bg-[#f5f7f2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto mb-10 flex max-w-4xl flex-col items-center text-center">
            <h1 className="mb-5 max-w-4xl text-4xl font-extrabold leading-tight text-[#17221d] md:text-6xl">
              {ns(namespace, 'h1')}
            </h1>
            {showTopAd ? <GoogleAd /> : null}
            <p className="max-w-3xl text-left text-lg leading-8 text-[#5c6d63] md:text-center">
              {ns(namespace, 'h1_desc')}
            </p>
          </div>
          {showFixedAd ? <GoogleAdFixed /> : null}
          {children}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function ToolPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1112px]">
      <div className="overflow-hidden rounded-lg border border-[#d8e4dc] bg-white shadow-xl shadow-[#173d2a14]">
        <form className="relative">{children}</form>
      </div>
    </div>
  );
}

export function TextAreaBox({
  id,
  value,
  placeholder,
  mono = false,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  mono?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-white p-3 focus-within:ring-2 focus-within:ring-[#3fa87a]/30">
      <textarea
        rows={10}
        name={id}
        id={id}
        className={`block min-h-[300px] w-full resize-y rounded-lg border border-[#d8e4dc] bg-[#fbfcf8] p-5 text-base leading-7 text-[#17221d] outline-none placeholder:text-[#8a9a91] focus:border-[#3fa87a] ${mono ? 'font-mono' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function ButtonGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[#d8e4dc] bg-[#fffdf8] p-3 text-[#17221d] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

export function ToolButton({
  children,
  onClick,
  primary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={`min-h-10 cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        primary
          ? 'border-[#17221d] bg-[#17221d] text-white shadow-sm hover:bg-[#26342e]'
          : 'border-[#d8e4dc] bg-white text-[#314139] hover:border-[#9ccfb9] hover:bg-[#edf4ef]'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
