import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = 'ca-pub-7741547389250990';
let adsenseScriptPromise: Promise<void> | null = null;
let adPushQueue = Promise.resolve();

function ensureAdsenseScript() {
  const scriptId = 'adsbygoogle-js';
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (existing) {
    if (existing.dataset.loaded === 'true' || window.adsbygoogle) {
      return Promise.resolve();
    }

    adsenseScriptPromise ??= new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => resolve(), { once: true });
    });
    return adsenseScriptPromise;
  }

  adsenseScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = 'anonymous';
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', () => resolve(), { once: true });
    document.head.appendChild(script);
  });

  return adsenseScriptPromise;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function pushAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('AdSense init failed', error);
  }
}

function requestAd(ins: HTMLElement) {
  adPushQueue = adPushQueue
    .catch(() => undefined)
    .then(async () => {
      await ensureAdsenseScript();
      await wait(100);
      if (!ins.isConnected || ins.hasAttribute('data-adsbygoogle-status')) return;
      pushAd();
      await wait(100);
    });
}

function collapseUnfilledAd(ins: HTMLElement) {
  const container = ins.parentElement;
  if (!container) return;

  const syncVisibility = () => {
    if (ins.getAttribute('data-ad-status') === 'unfilled') {
      container.style.display = 'none';
      return;
    }
    container.style.display = '';
  };

  const observer = new MutationObserver(syncVisibility);
  observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
  let checks = 0;
  const interval = window.setInterval(() => {
    checks += 1;
    syncVisibility();
    if (checks >= 20 || ins.getAttribute('data-ad-status') === 'filled') {
      window.clearInterval(interval);
    }
  }, 500);

  return () => {
    observer.disconnect();
    window.clearInterval(interval);
  };
}

// Defer ad loading until the slot is within ~400px of the viewport, so the
// heavy AdSense script never competes with the initial render / LCP.
function whenNearViewport(target: Element, onEnter: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter();
    return () => undefined;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        onEnter();
      }
    },
    { rootMargin: '400px' }
  );
  observer.observe(target);
  return () => observer.disconnect();
}

export function GoogleAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    let cleanupAd: (() => void) | undefined;
    const stopObserving = whenNearViewport(container, () => {
      if (initialized.current || !adRef.current) return;
      adRef.current.innerHTML = '';
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', ADSENSE_CLIENT);
      ins.setAttribute('data-ad-slot', '7321261240');
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      adRef.current.appendChild(ins);
      initialized.current = true;
      cleanupAd = collapseUnfilledAd(ins);
      requestAd(ins);
    });

    return () => {
      stopObserving();
      cleanupAd?.();
    };
  }, []);

  return <div ref={adRef} className="w-full" />;
}

export function GoogleAdFixed() {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    const stopObserving = whenNearViewport(container, () => {
      if (initialized.current || !adRef.current) return;
      adRef.current.innerHTML = '';
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'inline-block';
      ins.style.width = '728px';
      ins.style.height = '90px';
      ins.setAttribute('data-ad-client', ADSENSE_CLIENT);
      ins.setAttribute('data-ad-slot', '9909889778');
      adRef.current.appendChild(ins);
      initialized.current = true;
      requestAd(ins);
    });

    return stopObserving;
  }, []);

  return (
    <div className="my-4 flex justify-center">
      <div
        ref={adRef}
        style={{ minHeight: 96, width: 728, maxWidth: '100%' }}
      />
    </div>
  );
}
