export function formatHtml(html: string): string {
  let formatted = html.trim();
  formatted = formatted.replace(/>\s*</g, '>\n<');
  formatted = formatted.replace(/<!--(.*?)-->/g, '\n<!--$1-->\n');

  const lines = formatted.split('\n');
  const indentSize = 2;
  const tagStack: string[] = [];

  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      const getTagName = (tag: string) => {
        const match = tag.match(/<\/?([^\s>/]+)/);
        return match ? match[1].toLowerCase() : '';
      };
      const isSelfClosing = (tag: string) =>
        /\/>$/.test(tag) ||
        /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([>\s]|$)/i.test(tag);
      const isClosingTag = (tag: string) => /^<\//.test(tag);
      const isOpeningTag = (tag: string) => /^<[^/]/.test(tag) && !isSelfClosing(tag);

      let indent = tagStack.length;
      if (isClosingTag(trimmed)) {
        const tagName = getTagName(trimmed);
        let found = false;
        for (let i = tagStack.length - 1; i >= 0; i -= 1) {
          if (tagStack[i] === tagName) {
            tagStack.splice(i);
            found = true;
            indent = i;
            break;
          }
        }
        if (!found) indent = Math.max(0, tagStack.length - 1);
      } else if (isOpeningTag(trimmed)) {
        tagStack.push(getTagName(trimmed));
      }

      if (isSelfClosing(trimmed) || trimmed.startsWith('<!--')) {
        indent = tagStack.length;
      }

      return ' '.repeat(Math.max(0, indent) * indentSize) + trimmed;
    })
    .join('\n');
}

