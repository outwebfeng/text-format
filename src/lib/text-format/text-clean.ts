export type TextCleanOptions = {
  removePunctuation: boolean;
  stripEmojis: boolean;
  removeNonASCII: boolean;
  removeNonAlphanumeric: boolean;
  removeEmails: boolean;
  unescapeHtml: boolean;
  removeHtmlTags: boolean;
  removeHtmlIds: boolean;
  removeHtmlClasses: boolean;
  decodeHtmlEntities: boolean;
  decodeUrlChars: boolean;
  addLineToLeft: string;
  addLineToRight: string;
  removeLineFromLeft: number;
  removeLineFromRight: number;
  findText: string;
  replaceText: string;
  spaceCount: number;
  tabCount: number;
};

export const defaultTextCleanOptions: TextCleanOptions = {
  removePunctuation: false,
  stripEmojis: false,
  removeNonASCII: false,
  removeNonAlphanumeric: false,
  removeEmails: false,
  unescapeHtml: false,
  removeHtmlTags: false,
  removeHtmlIds: false,
  removeHtmlClasses: false,
  decodeHtmlEntities: false,
  decodeUrlChars: false,
  addLineToLeft: '',
  addLineToRight: '',
  removeLineFromLeft: 0,
  removeLineFromRight: 0,
  findText: '',
  replaceText: '',
  spaceCount: 0,
  tabCount: 0,
};

const htmlEntities: Record<string, string> = {
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': '\u00A0',
  '&iexcl;': '\u00A1',
  '&cent;': '\u00A2',
  '&pound;': '\u00A3',
  '&curren;': '\u00A4',
  '&yen;': '\u00A5',
  '&brvbar;': '\u00A6',
  '&sect;': '\u00A7',
  '&uml;': '\u00A8',
  '&copy;': '\u00A9',
  '&ordf;': '\u00AA',
  '&laquo;': '\u00AB',
  '&not;': '\u00AC',
  '&shy;': '\u00AD',
  '&reg;': '\u00AE',
  '&macr;': '\u00AF',
  '&deg;': '\u00B0',
  '&plusmn;': '\u00B1',
  '&sup2;': '\u00B2',
  '&sup3;': '\u00B3',
  '&acute;': '\u00B4',
  '&micro;': '\u00B5',
  '&para;': '\u00B6',
  '&middot;': '\u00B7',
  '&cedil;': '\u00B8',
  '&sup1;': '\u00B9',
  '&ordm;': '\u00BA',
  '&raquo;': '\u00BB',
  '&frac14;': '\u00BC',
  '&frac12;': '\u00BD',
  '&frac34;': '\u00BE',
  '&iquest;': '\u00BF',
  '&times;': '\u00D7',
  '&divide;': '\u00F7',
  '&Alpha;': '\u0391',
  '&Beta;': '\u0392',
  '&Gamma;': '\u0393',
  '&Delta;': '\u0394',
  '&Epsilon;': '\u0395',
  '&Zeta;': '\u0396',
  '&Eta;': '\u0397',
  '&Theta;': '\u0398',
  '&Iota;': '\u0399',
  '&Kappa;': '\u039A',
  '&Lambda;': '\u039B',
  '&Mu;': '\u039C',
  '&Nu;': '\u039D',
  '&Xi;': '\u039E',
  '&Omicron;': '\u039F',
  '&Pi;': '\u03A0',
  '&Rho;': '\u03A1',
  '&Sigma;': '\u03A3',
  '&Tau;': '\u03A4',
  '&Upsilon;': '\u03A5',
  '&Phi;': '\u03A6',
  '&Chi;': '\u03A7',
  '&Psi;': '\u03A8',
  '&Omega;': '\u03A9',
  '&alpha;': '\u03B1',
  '&beta;': '\u03B2',
  '&gamma;': '\u03B3',
  '&delta;': '\u03B4',
  '&epsilon;': '\u03B5',
  '&zeta;': '\u03B6',
  '&eta;': '\u03B7',
  '&theta;': '\u03B8',
  '&iota;': '\u03B9',
  '&kappa;': '\u03BA',
  '&lambda;': '\u03BB',
  '&mu;': '\u03BC',
  '&nu;': '\u03BD',
  '&xi;': '\u03BE',
  '&omicron;': '\u03BF',
  '&pi;': '\u03C0',
  '&rho;': '\u03C1',
  '&sigmaf;': '\u03C2',
  '&sigma;': '\u03C3',
  '&tau;': '\u03C4',
  '&upsilon;': '\u03C5',
  '&phi;': '\u03C6',
  '&chi;': '\u03C7',
  '&psi;': '\u03C8',
  '&omega;': '\u03C9',
  '&thetasym;': '\u03D1',
  '&upsih;': '\u03D2',
  '&piv;': '\u03D6',
  '&bull;': '\u2022',
  '&hellip;': '\u2026',
  '&prime;': '\u2032',
  '&Prime;': '\u2033',
  '&oline;': '\u203E',
  '&frasl;': '\u2044',
  '&weierp;': '\u2118',
  '&image;': '\u2111',
  '&real;': '\u211C',
  '&trade;': '\u2122',
  '&alefsym;': '\u2135',
  '&larr;': '\u2190',
  '&uarr;': '\u2191',
  '&rarr;': '\u2192',
  '&darr;': '\u2193',
  '&harr;': '\u2194',
  '&crarr;': '\u21B5',
  '&lArr;': '\u21D0',
  '&uArr;': '\u21D1',
  '&rArr;': '\u21D2',
  '&dArr;': '\u21D3',
  '&hArr;': '\u21D4',
  '&forall;': '\u2200',
  '&part;': '\u2202',
  '&exist;': '\u2203',
  '&empty;': '\u2205',
  '&nabla;': '\u2207',
  '&isin;': '\u2208',
  '&notin;': '\u2209',
  '&ni;': '\u220B',
  '&prod;': '\u220F',
  '&sum;': '\u2211',
  '&minus;': '\u2212',
  '&lowast;': '\u2217',
  '&radic;': '\u221A',
  '&prop;': '\u221D',
  '&infin;': '\u221E',
  '&ang;': '\u2220',
  '&and;': '\u2227',
  '&or;': '\u2228',
  '&cap;': '\u2229',
  '&cup;': '\u222A',
  '&int;': '\u222B',
  '&there4;': '\u2234',
  '&sim;': '\u223C',
  '&cong;': '\u2245',
  '&asymp;': '\u2248',
  '&ne;': '\u2260',
  '&equiv;': '\u2261',
  '&le;': '\u2264',
  '&ge;': '\u2265',
  '&sub;': '\u2282',
  '&sup;': '\u2283',
  '&nsub;': '\u2284',
  '&sube;': '\u2286',
  '&supe;': '\u2287',
  '&oplus;': '\u2295',
  '&otimes;': '\u2297',
  '&perp;': '\u22A5',
  '&sdot;': '\u22C5',
  '&lceil;': '\u2308',
  '&rceil;': '\u2309',
  '&lfloor;': '\u230A',
  '&rfloor;': '\u230B',
  '&lang;': '\u2329',
  '&rang;': '\u232A',
  '&loz;': '\u25CA',
  '&spades;': '\u2660',
  '&clubs;': '\u2663',
  '&hearts;': '\u2665',
  '&diams;': '\u2666',
};

function decodeEntities(text: string): string {
  return Object.entries(htmlEntities).reduce(
    (next, [entity, value]) => next.replace(new RegExp(entity, 'g'), value),
    text
  );
}

export function applyTextCleanSettings(text: string, options: TextCleanOptions): string {
  let modifiedText = text;

  if (options.removePunctuation) {
    modifiedText = modifiedText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  }
  if (options.stripEmojis) {
    modifiedText = modifiedText.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\uFE00-\uFE0F]/g, '');
  }
  if (options.removeNonASCII) {
    modifiedText = modifiedText.replace(/[^\x00-\x7F]/g, '');
  }
  if (options.removeNonAlphanumeric) {
    modifiedText = modifiedText.replace(/[^a-zA-Z0-9]/g, '');
  }
  if (options.removeEmails) {
    modifiedText = modifiedText.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '');
  }

  if (options.unescapeHtml) {
    modifiedText = decodeEntities(modifiedText);
  }
  if (options.removeHtmlTags) {
    modifiedText = modifiedText.replace(/<\/?[^>]+(>|$)/g, '');
  }
  if (options.removeHtmlIds) {
    modifiedText = modifiedText.replace(/id="[^"]*"/g, '');
  }
  if (options.removeHtmlClasses) {
    modifiedText = modifiedText.replace(/class="[^"]*"/g, '');
  }
  if (options.decodeHtmlEntities) {
    modifiedText = decodeEntities(modifiedText);
  }
  if (options.decodeUrlChars) {
    try {
      modifiedText = decodeURIComponent(modifiedText);
    } catch {
      // Preserve earlier cleanup steps if URL decoding fails on malformed input.
    }
  }

  if (options.findText && options.replaceText) {
    try {
      modifiedText = modifiedText.replace(new RegExp(options.findText, 'g'), options.replaceText);
    } catch {
      modifiedText = modifiedText.split(options.findText).join(options.replaceText);
    }
  }
  if (options.spaceCount > 0) {
    const spacePattern = ' '.repeat(options.spaceCount);
    modifiedText = modifiedText.replace(new RegExp(spacePattern, 'g'), '\t');
  }
  if (options.tabCount > 0) {
    modifiedText = modifiedText.replace(/\t/g, ' '.repeat(options.tabCount));
  }

  return modifiedText
    .split('\n')
    .map((line) => {
      let next = line;
      if (options.addLineToLeft) next = options.addLineToLeft + next;
      if (options.addLineToRight) next += options.addLineToRight;
      if (options.removeLineFromLeft > 0) {
        next = next.substring(Math.min(next.length, options.removeLineFromLeft));
      }
      if (options.removeLineFromRight > 0) {
        next = next.substring(0, Math.max(0, next.length - options.removeLineFromRight));
      }
      return next;
    })
    .join('\n');
}

export function removeExtraSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeEmptyLines(text: string): string {
  return text.replace(/^\s*$(?:\r\n?|\n)/gm, '');
}

export function removeLineBreaks(text: string): string {
  return text.replace(/\n/g, ' ');
}

export function capitalizeSentences(text: string): string {
  return text.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/gi, (c) => c.toUpperCase());
}

export function capitalizeWords(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function removeDuplicateLines(text: string): string {
  return Array.from(new Set(text.split(/\r?\n/))).join('\n');
}
