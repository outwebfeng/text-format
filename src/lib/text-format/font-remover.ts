function buildFontMappings(): Map<string, string> {
  const mappings = new Map<string, string>();

  const addAlphabetRange = (start: number) => {
    for (let i = 0; i < 26; i += 1) {
      mappings.set(String.fromCodePoint(start + i), String.fromCharCode(65 + i));
      mappings.set(String.fromCodePoint(start + 26 + i), String.fromCharCode(97 + i));
    }
  };

  [
    0x1d400, 0x1d434, 0x1d468, 0x1d49c, 0x1d4d0, 0x1d504, 0x1d56c,
    0x1d538, 0x1d5a0, 0x1d5d4, 0x1d608, 0x1d63c, 0x1d670,
  ].forEach(addAlphabetRange);

  [0x1d7ce, 0x1d7d8, 0x1d7e2, 0x1d7ec, 0x1d7f6].forEach((start) => {
    for (let i = 0; i < 10; i += 1) {
      mappings.set(String.fromCodePoint(start + i), String.fromCharCode(48 + i));
    }
  });

  for (let i = 0; i < 26; i += 1) {
    mappings.set(String.fromCodePoint(0x24b6 + i), String.fromCharCode(65 + i));
    mappings.set(String.fromCodePoint(0x24d0 + i), String.fromCharCode(97 + i));
    mappings.set(String.fromCodePoint(0x249c + i), String.fromCharCode(97 + i));
    mappings.set(String.fromCodePoint(0xff21 + i), String.fromCharCode(65 + i));
    mappings.set(String.fromCodePoint(0xff41 + i), String.fromCharCode(97 + i));
  }

  for (let i = 0; i < 20; i += 1) {
    mappings.set(String.fromCodePoint(0x2460 + i), i < 9 ? String.fromCharCode(49 + i) : String(i + 1));
  }
  for (let i = 0; i < 10; i += 1) {
    mappings.set(String.fromCodePoint(0xff10 + i), String.fromCharCode(48 + i));
  }

  const extra: Record<string, string> = {
    '\u2160': '1', '\u2161': '2', '\u2162': '3', '\u2163': '4', '\u2164': '5',
    '\u2165': '6', '\u2166': '7', '\u2167': '8', '\u2168': '9', '\u2169': '10',
    '\u216A': '11', '\u216B': '12', '\u216C': '50', '\u216D': '100',
    '\u216E': '500', '\u216F': '1000', '\u2170': '1', '\u2171': '2',
    '\u2172': '3', '\u2173': '4', '\u2174': '5', '\u2175': '6',
    '\u2176': '7', '\u2177': '8', '\u2178': '9', '\u2179': '10',
    '\u217A': '11', '\u217B': '12', '\u217C': '50', '\u217D': '100',
    '\u217E': '500', '\u217F': '1000',
    '\u2070': '0', '\u00B9': '1', '\u00B2': '2', '\u00B3': '3',
    '\u2074': '4', '\u2075': '5', '\u2076': '6', '\u2077': '7',
    '\u2078': '8', '\u2079': '9', '\u1D43': 'a', '\u1D47': 'b',
    '\u1D9C': 'c', '\u1D48': 'd', '\u1D49': 'e', '\u1DA0': 'f',
    '\u1D4D': 'g', '\u02B0': 'h', '\u2071': 'i', '\u02B2': 'j',
    '\u1D4F': 'k', '\u02E1': 'l', '\u1D50': 'm', '\u207F': 'n',
    '\u1D52': 'o', '\u1D56': 'p', '\u02B3': 'r', '\u02E2': 's',
    '\u1D57': 't', '\u1D58': 'u', '\u1D5B': 'v', '\u02B7': 'w',
    '\u02E3': 'x', '\u02B8': 'y', '\u1DBB': 'z',
    '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3',
    '\u2084': '4', '\u2085': '5', '\u2086': '6', '\u2087': '7',
    '\u2088': '8', '\u2089': '9', '\u2090': 'a', '\u2091': 'e',
    '\u2095': 'h', '\u1D62': 'i', '\u2C7C': 'j', '\u2096': 'k',
    '\u2097': 'l', '\u2098': 'm', '\u2099': 'n', '\u2092': 'o',
    '\u209A': 'p', '\u1D63': 'r', '\u209B': 's', '\u209C': 't',
    '\u1D64': 'u', '\u1D65': 'v', '\u2093': 'x',
    '\u0250': 'a', '\u026F': 'm', '\u01DD': 'e', '\u0279': 'r',
    '\u0287': 't', '\u028E': 'y', '\u028C': 'v',
    '\u{1F150}': 'A', '\u{1F151}': 'B', '\u{1F152}': 'C', '\u{1F153}': 'D',
    '\u{1F154}': 'E', '\u{1F155}': 'F', '\u{1F156}': 'G', '\u{1F157}': 'H',
    '\u{1F158}': 'I', '\u{1F159}': 'J', '\u{1F15A}': 'K', '\u{1F15B}': 'L',
    '\u{1F15C}': 'M', '\u{1F15D}': 'N', '\u{1F15E}': 'O', '\u{1F15F}': 'P',
    '\u{1F160}': 'Q', '\u{1F161}': 'R', '\u{1F162}': 'S', '\u{1F163}': 'T',
    '\u{1F164}': 'U', '\u{1F165}': 'V', '\u{1F166}': 'W', '\u{1F167}': 'X',
    '\u{1F168}': 'Y', '\u{1F169}': 'Z',
  };

  Object.entries(extra).forEach(([styled, normal]) => mappings.set(styled, normal));
  return mappings;
}

const fontMappings = buildFontMappings();

export function removeFonts(text: string, preserveSymbols = ''): string {
  if (!text) return '';
  const preserveChars = new Set(preserveSymbols.split(''));
  let result = '';

  for (const char of text) {
    if (preserveChars.has(char)) {
      result += char;
      continue;
    }
    result += fontMappings.get(char) ?? char;
  }

  return result;
}

