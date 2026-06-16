export type RemoveDuplicatesOptions = {
  ignoreCase: boolean;
  sortAscending: boolean;
  sortDescending: boolean;
};

export function removeDuplicateLinesAdvanced(
  text: string,
  options: RemoveDuplicatesOptions
): string {
  if (!text.trim()) return text;
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of text.split(/\r?\n/)) {
    const compareStr = options.ignoreCase ? line.toLowerCase() : line;
    if (!seen.has(compareStr)) {
      seen.add(compareStr);
      uniqueLines.push(line);
    }
  }

  if (options.sortAscending) {
    uniqueLines.sort((a, b) =>
      (options.ignoreCase ? a.toLowerCase() : a).localeCompare(
        options.ignoreCase ? b.toLowerCase() : b
      )
    );
  } else if (options.sortDescending) {
    uniqueLines.sort((a, b) =>
      (options.ignoreCase ? b.toLowerCase() : b).localeCompare(
        options.ignoreCase ? a.toLowerCase() : a
      )
    );
  }

  return uniqueLines.join('\n');
}

