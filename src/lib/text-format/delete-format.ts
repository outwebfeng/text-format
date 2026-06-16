export type DeleteFormatOptions = {
  removeSpaces: boolean;
  removeNewlines: boolean;
  removeFormatting: boolean;
  removeIndentation: boolean;
};

export function deleteFormat(text: string, options: DeleteFormatOptions): string {
  let modifiedText = text;
  if (options.removeSpaces) modifiedText = modifiedText.replace(/\s+/g, ' ').trim();
  if (options.removeNewlines) modifiedText = modifiedText.replace(/[\r\n]+/g, ' ');
  if (options.removeFormatting) modifiedText = modifiedText.replace(/[\t\f\v]/g, '');
  if (options.removeIndentation) modifiedText = modifiedText.replace(/^[\s\t]+/gm, '');
  return modifiedText;
}

