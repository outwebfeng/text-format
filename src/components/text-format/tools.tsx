import confetti from 'canvas-confetti';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { ButtonGrid, TextAreaBox, ToolButton, ToolPanel } from './layout';

import { deleteFormat } from '@/lib/text-format/delete-format';
import { formatHtml } from '@/lib/text-format/format-html';
import { removeFonts } from '@/lib/text-format/font-remover';
import { ns } from '@/lib/text-format/messages';
import { removeDuplicateLinesAdvanced } from '@/lib/text-format/remove-duplicates';
import {
  applyTextCleanSettings,
  capitalizeSentences,
  capitalizeWords,
  defaultTextCleanOptions,
  removeDuplicateLines,
  removeEmptyLines,
  removeExtraSpaces,
  removeLineBreaks,
  type TextCleanOptions,
} from '@/lib/text-format/text-clean';

const inlineInputClass =
  'h-10 rounded-lg border border-[#d8e4dc] bg-white px-3 text-[#17221d] outline-none transition focus:border-[#3fa87a] focus:ring-2 focus:ring-[#3fa87a]/20';
const secondaryActionClass =
  'mt-4 mr-2 rounded-lg border border-[#d8e4dc] bg-white px-4 py-2 text-sm font-semibold text-[#314139] transition hover:border-[#9ccfb9] hover:bg-[#edf4ef]';
const primaryActionClass =
  'mt-4 rounded-lg border border-[#17221d] bg-[#17221d] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26342e]';

async function copyWithConfetti(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    confetti({ particleCount: 300, spread: 200, origin: { y: 0.6 } });
  } catch (error) {
    alert(`Failed to copy text: ${error}`);
  }
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#d8e4dc] py-5 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-xl font-bold text-[#17221d]">{title}</h2>
      {children}
    </section>
  );
}

function CheckControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[#d8e4dc] bg-white px-3 py-2 text-sm font-medium text-[#506259] transition hover:border-[#9ccfb9] hover:bg-[#edf4ef]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#2f936a]"
      />
      <span>{label}</span>
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  className = 'w-20',
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(Number.parseInt(event.target.value, 10) || 0)}
      className={`${inlineInputClass} ${className}`}
      min="0"
      step="1"
      inputMode="numeric"
    />
  );
}

export function TextCleanTool() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<TextCleanOptions>(defaultTextCleanOptions);
  const updateOption = <K extends keyof TextCleanOptions>(key: K, value: TextCleanOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }));
  const selectAll = () =>
    setOptions((current) => ({
      ...current,
      removePunctuation: true,
      stripEmojis: true,
      removeNonASCII: true,
      removeNonAlphanumeric: true,
      removeEmails: true,
      unescapeHtml: true,
      removeHtmlTags: true,
      removeHtmlIds: true,
      removeHtmlClasses: true,
      decodeHtmlEntities: true,
      decodeUrlChars: true,
    }));

  return (
    <ToolPanel>
      <TextAreaBox
        id="contentText"
        value={text}
        placeholder={ns('textClean', 'default_text')}
        onChange={setText}
      />
      <ButtonGrid>
        <ToolButton onClick={() => setText(removeExtraSpaces(text))}>
          {ns('textClean', 'common_remove_extra_sapces')}
        </ToolButton>
        <ToolButton onClick={() => setText(removeEmptyLines(text))}>
          {ns('textClean', 'common_remove_empty_lines')}
        </ToolButton>
        <ToolButton onClick={() => setText(removeLineBreaks(text))}>
          {ns('textClean', 'common_remove_line_breaks')}
        </ToolButton>
        <ToolButton onClick={() => setText(text.toUpperCase())}>
          {ns('textClean', 'common_uppercase_all')}
        </ToolButton>
        <ToolButton onClick={() => setText(text.toLowerCase())}>
          {ns('textClean', 'common_lowercase_all')}
        </ToolButton>
        <ToolButton onClick={() => setText(capitalizeSentences(text))}>
          {ns('textClean', 'common_capitalize_sentences')}
        </ToolButton>
        <ToolButton onClick={() => setText(capitalizeWords(text))}>
          {ns('textClean', 'common_capitalize_words')}
        </ToolButton>
        <ToolButton onClick={() => setText(removeDuplicateLines(text))}>
          {ns('textClean', 'common_remove_duplicate_lines')}
        </ToolButton>
        <ToolButton onClick={() => void copyWithConfetti(text)}>
          {ns('textClean', 'common_copy')}
        </ToolButton>
        <ToolButton onClick={() => setText('')}>{ns('textClean', 'common_clear')}</ToolButton>
      </ButtonGrid>
      <div className="border-t border-[#d8e4dc] bg-[#fbfcf8] p-5 text-[#506259] md:p-6">
        <SettingsSection title={ns('textClean', 'char_setting')}>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <CheckControl label={ns('textClean', 'char_remove_puctuation_marks')} checked={options.removePunctuation} onChange={(value) => updateOption('removePunctuation', value)} />
            <CheckControl label={ns('textClean', 'char_strip_all_emojis')} checked={options.stripEmojis} onChange={(value) => updateOption('stripEmojis', value)} />
            <CheckControl label={ns('textClean', 'char_remove_non_ascii_characters')} checked={options.removeNonASCII} onChange={(value) => updateOption('removeNonASCII', value)} />
            <CheckControl label={ns('textClean', 'char_remove_non_alphanumeric_characters')} checked={options.removeNonAlphanumeric} onChange={(value) => updateOption('removeNonAlphanumeric', value)} />
            <CheckControl label={ns('textClean', 'char_remove_all_emails')} checked={options.removeEmails} onChange={(value) => updateOption('removeEmails', value)} />
          </div>
        </SettingsSection>

        <SettingsSection title={ns('textClean', 'html_setting')}>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <CheckControl label={ns('textClean', 'html_unexcape_html_tags')} checked={options.unescapeHtml} onChange={(value) => updateOption('unescapeHtml', value)} />
            <CheckControl label={ns('textClean', 'html_remove_all_html_tags')} checked={options.removeHtmlTags} onChange={(value) => updateOption('removeHtmlTags', value)} />
            <CheckControl label={ns('textClean', 'html_remove_all_ids')} checked={options.removeHtmlIds} onChange={(value) => updateOption('removeHtmlIds', value)} />
            <CheckControl label={ns('textClean', 'html_remove_all_classes')} checked={options.removeHtmlClasses} onChange={(value) => updateOption('removeHtmlClasses', value)} />
            <CheckControl label={ns('textClean', 'html_decode_html_character_entities')} checked={options.decodeHtmlEntities} onChange={(value) => updateOption('decodeHtmlEntities', value)} />
            <CheckControl label={ns('textClean', 'html_decode_url_encoded_characters')} checked={options.decodeUrlChars} onChange={(value) => updateOption('decodeUrlChars', value)} />
          </div>
        </SettingsSection>

        <SettingsSection title={ns('textClean', 'multiple_line_setting')}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'line_add')}</span>
            <input value={options.addLineToLeft} onChange={(event) => updateOption('addLineToLeft', event.target.value)} className={`${inlineInputClass} w-36`} />
            <span>{ns('textClean', 'line_to_left')}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'line_add')}</span>
            <input value={options.addLineToRight} onChange={(event) => updateOption('addLineToRight', event.target.value)} className={`${inlineInputClass} w-36`} />
            <span>{ns('textClean', 'line_to_right')}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'line_remove')}</span>
            <NumberInput value={options.removeLineFromLeft} onChange={(value) => updateOption('removeLineFromLeft', value)} />
            <span>{ns('textClean', 'line_from_left')}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'line_remove')}</span>
            <NumberInput value={options.removeLineFromRight} onChange={(value) => updateOption('removeLineFromRight', value)} />
            <span>{ns('textClean', 'line_from_right')}</span>
          </div>
        </SettingsSection>

        <SettingsSection title={ns('textClean', 'find_replace_setting')}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'find_find')}</span>
            <input value={options.findText} onChange={(event) => updateOption('findText', event.target.value)} className={`${inlineInputClass} w-36`} />
            <span>{ns('textClean', 'find_replace_text')}</span>
            <input value={options.replaceText} onChange={(event) => updateOption('replaceText', event.target.value)} className={`${inlineInputClass} w-36`} />
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'find_replace')}</span>
            <NumberInput value={options.spaceCount} onChange={(value) => updateOption('spaceCount', value)} className="w-12" />
            <span>{ns('textClean', 'find_replace_with_tab')}</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span>{ns('textClean', 'find_replace_with_space')}</span>
            <NumberInput value={options.tabCount} onChange={(value) => updateOption('tabCount', value)} className="w-12" />
            <span>{ns('textClean', 'find_replace_space')}</span>
          </div>
        </SettingsSection>

        <button type="button" className={secondaryActionClass} onClick={selectAll}>
          {ns('textClean', 'select_all')}
        </button>
        <button type="button" className={secondaryActionClass} onClick={() => setOptions(defaultTextCleanOptions)}>
          {ns('textClean', 'select_none')}
        </button>
        <button
          type="button"
          className={primaryActionClass}
          onClick={() => setText(applyTextCleanSettings(text, options))}
        >
          {ns('textClean', 'text_clean_apply')}
        </button>
      </div>
    </ToolPanel>
  );
}

export function DeleteFormatTool() {
  const [text, setText] = useState('');
  const [removeSpaces, setRemoveSpaces] = useState(false);
  const [removeNewlines, setRemoveNewlines] = useState(false);
  const [removeFormatting, setRemoveFormatting] = useState(false);
  const [removeIndentation, setRemoveIndentation] = useState(false);

  return (
    <ToolPanel>
      <TextAreaBox id="contentText" value={text} placeholder={ns('deleteFormat', 'default_text')} onChange={setText} />
      <ButtonGrid>
        <ToolButton onClick={() => void copyWithConfetti(text)}>{ns('deleteFormat', 'copy')}</ToolButton>
        <ToolButton onClick={() => setText('')}>{ns('deleteFormat', 'clear')}</ToolButton>
      </ButtonGrid>
      <div className="border-t border-[#d8e4dc] bg-[#fbfcf8] p-5 text-[#506259] md:p-6">
        <h2 className="mb-4 text-xl font-bold text-[#17221d]">{ns('deleteFormat', 'format_settings')}</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CheckControl label={ns('deleteFormat', 'remove_spaces')} checked={removeSpaces} onChange={setRemoveSpaces} />
          <CheckControl label={ns('deleteFormat', 'remove_newlines')} checked={removeNewlines} onChange={setRemoveNewlines} />
          <CheckControl label={ns('deleteFormat', 'remove_formatting')} checked={removeFormatting} onChange={setRemoveFormatting} />
          <CheckControl label={ns('deleteFormat', 'remove_indentation')} checked={removeIndentation} onChange={setRemoveIndentation} />
        </div>
        <button
          type="button"
          className={primaryActionClass}
          onClick={() => setText(deleteFormat(text, { removeSpaces, removeNewlines, removeFormatting, removeIndentation }))}
        >
          {ns('deleteFormat', 'apply')}
        </button>
      </div>
    </ToolPanel>
  );
}

export function FormatHtmlTool() {
  const [text, setText] = useState('');
  return (
    <ToolPanel>
      <TextAreaBox id="htmlInput" value={text} placeholder={ns('formatHtml', 'default_text')} mono onChange={setText} />
      <ButtonGrid>
        <ToolButton primary onClick={() => setText(formatHtml(text))}>{ns('formatHtml', 'format')}</ToolButton>
        <ToolButton onClick={() => void copyWithConfetti(text)}>{ns('formatHtml', 'copy')}</ToolButton>
        <ToolButton onClick={() => setText('')}>{ns('formatHtml', 'clear')}</ToolButton>
      </ButtonGrid>
    </ToolPanel>
  );
}

export function RemoveDuplicatesTool() {
  const [text, setText] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [sortDescending, setSortDescending] = useState(false);
  return (
    <ToolPanel>
      <TextAreaBox id="contentText" value={text} placeholder={ns('removeDuplicates', 'default_text')} onChange={setText} />
      <ButtonGrid>
        <ToolButton onClick={() => void copyWithConfetti(text)}>{ns('removeDuplicates', 'copy')}</ToolButton>
        <ToolButton onClick={() => setText('')}>{ns('removeDuplicates', 'clear')}</ToolButton>
      </ButtonGrid>
      <div className="border-t border-[#d8e4dc] bg-[#fbfcf8] p-5 text-[#506259] md:p-6">
        <h2 className="mb-4 text-xl font-bold text-[#17221d]">{ns('removeDuplicates', 'duplicate_settings')}</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <CheckControl label={ns('removeDuplicates', 'ignore_case')} checked={ignoreCase} onChange={setIgnoreCase} />
          <CheckControl label={ns('removeDuplicates', 'sort_ascending')} checked={sortAscending} onChange={(value) => { setSortAscending(value); if (value) setSortDescending(false); }} />
          <CheckControl label={ns('removeDuplicates', 'sort_descending')} checked={sortDescending} onChange={(value) => { setSortDescending(value); if (value) setSortAscending(false); }} />
        </div>
        <button
          type="button"
          className={primaryActionClass}
          onClick={() => setText(removeDuplicateLinesAdvanced(text, { ignoreCase, sortAscending, sortDescending }))}
        >
          {ns('removeDuplicates', 'apply')}
        </button>
      </div>
    </ToolPanel>
  );
}

export function FontRemoverTool() {
  const [text, setText] = useState('');
  const [preserveSymbols, setPreserveSymbols] = useState('');
  return (
    <ToolPanel>
      <TextAreaBox id="contentText" value={text} placeholder={ns('fontRemover', 'default_text')} onChange={setText} />
      <ButtonGrid>
        <ToolButton onClick={() => void copyWithConfetti(text)}>{ns('fontRemover', 'copy')}</ToolButton>
        <ToolButton onClick={() => setText('')}>{ns('fontRemover', 'clear')}</ToolButton>
      </ButtonGrid>
      <div className="border-t border-[#d8e4dc] bg-[#fbfcf8] p-5 text-[#506259] md:p-6">
        <h2 className="mb-4 text-xl font-bold text-[#17221d]">{ns('fontRemover', 'font_settings')}</h2>
        <div className="mb-4 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#314139]">{ns('fontRemover', 'preserve_symbols')}</label>
            <input
              type="text"
              className={`${inlineInputClass} w-full`}
              placeholder={ns('fontRemover', 'preserve_symbols_placeholder')}
              value={preserveSymbols}
              onChange={(event) => setPreserveSymbols(event.target.value)}
            />
            <p className="mt-2 text-sm leading-6 text-[#6d7d74]">{ns('fontRemover', 'preserve_symbols_desc')}</p>
          </div>
        </div>
        <button
          type="button"
          className={primaryActionClass}
          onClick={() => setText(removeFonts(text, preserveSymbols))}
        >
          {ns('fontRemover', 'apply')}
        </button>
      </div>
    </ToolPanel>
  );
}
