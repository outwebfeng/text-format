"use client";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useState } from "react";
import HeadInfo from "~/components/HeadInfo";

// 正确导入confetti库
import confettiOriginal from 'canvas-confetti';

// 将非关键内容拆分为小组件，并在组件内部使用memo以避免不必要的重渲染
import { memo } from 'react';
import { Dispatch, SetStateAction } from 'react';

// 定义TextFormatControls组件的props接口
interface TextFormatControlsProps {
  textCleanText: any;
  removePunctuation: boolean;
  setRemovePunctuation: Dispatch<SetStateAction<boolean>>;
  stripEmojis: boolean;
  setStripEmojis: Dispatch<SetStateAction<boolean>>;
  removeNonASCII: boolean;
  setRemoveNonASCII: Dispatch<SetStateAction<boolean>>;
  removeNonAlphanumeric: boolean;
  setRemoveNonAlphanumeric: Dispatch<SetStateAction<boolean>>;
  removeEmails: boolean;
  setRemoveEmails: Dispatch<SetStateAction<boolean>>;
  unexcapeHtml: boolean;
  setUnexcapeHtml: Dispatch<SetStateAction<boolean>>;
  removeHtmlTags: boolean;
  setRemoveHtmlTags: Dispatch<SetStateAction<boolean>>;
  removeHtmlIds: boolean;
  setRemoveHtmlIds: Dispatch<SetStateAction<boolean>>;
  removeHtmlClasses: boolean;
  setRemoveHtmlClasses: Dispatch<SetStateAction<boolean>>;
  decodeHtmlEntities: boolean;
  setDecodeHtmlEntities: Dispatch<SetStateAction<boolean>>;
  decodeUrlChars: boolean;
  setDecodeUrlChars: Dispatch<SetStateAction<boolean>>;
  addLineToLeft: string;
  setAddLineToLeft: Dispatch<SetStateAction<string>>;
  addLineToRight: string;
  setAddLineToRight: Dispatch<SetStateAction<string>>;
  removeLineFromLeft: number;
  setRemoveLineFromLeft: Dispatch<SetStateAction<number>>;
  removeLineFromRight: number;
  setRemoveLineFromRight: Dispatch<SetStateAction<number>>;
  findText: string;
  setFindText: Dispatch<SetStateAction<string>>;
  replaceText: string;
  setReplaceText: Dispatch<SetStateAction<string>>;
  spaceCount: number;
  setSpaceCount: Dispatch<SetStateAction<number>>;
  tabCount: number;
  setTabCount: Dispatch<SetStateAction<number>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  selectAll: () => void;
  selectNone: () => void;
  applySettings: () => void;
}

// 定义HelpSection组件的props接口
interface HelpSectionProps {
  textCleanText: any;
}

// 定义PageComponent组件的props接口
interface PageComponentProps {
  locale?: string;
  indexLanguageText: any;
  textCleanText: any;
}

// 优化大型表单区域的渲染
const TextFormatControls = memo<TextFormatControlsProps>(({ 
  textCleanText, 
  removePunctuation, setRemovePunctuation,
  stripEmojis, setStripEmojis,
  removeNonASCII, setRemoveNonASCII,
  removeNonAlphanumeric, setRemoveNonAlphanumeric,
  removeEmails, setRemoveEmails,
  unexcapeHtml, setUnexcapeHtml,
  removeHtmlTags, setRemoveHtmlTags,
  removeHtmlIds, setRemoveHtmlIds,
  removeHtmlClasses, setRemoveHtmlClasses,
  decodeHtmlEntities, setDecodeHtmlEntities,
  decodeUrlChars, setDecodeUrlChars,
  addLineToLeft, setAddLineToLeft,
  addLineToRight, setAddLineToRight,
  removeLineFromLeft, setRemoveLineFromLeft,
  removeLineFromRight, setRemoveLineFromRight,
  findText, setFindText,
  replaceText, setReplaceText,
  spaceCount, setSpaceCount,
  tabCount, setTabCount,
  handleInputChange, 
  selectAll, 
  selectNone,
  applySettings
}) => {
  return (
    <div className="p-4 bg-white text-[#7c8aaa]">
      {/* 字符设置部分 */}
      <div className="flex justify-center items-center space-x-3 border-t border-gray-200 px-2 py-2"></div>
      <h2 className="text-2xl mb-4">
        {textCleanText.char_setting}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="char_remove_puctuation_marks"
            checked={removePunctuation}
            onChange={(e) => setRemovePunctuation(e.target.checked)}
          />
          <span>
            {textCleanText.char_remove_puctuation_marks}
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="char_strip_all_emojis"
            checked={stripEmojis}
            onChange={(e) => setStripEmojis(e.target.checked)}
          />
          <span>{textCleanText.char_strip_all_emojis}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="char_remove_non_ascii_characters"
            checked={removeNonASCII}
            onChange={(e) => setRemoveNonASCII(e.target.checked)}
          />
          <span>
            {textCleanText.char_remove_non_ascii_characters}
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="char_remove_non_alphanumeric_characters"
            checked={removeNonAlphanumeric}
            onChange={(e) => setRemoveNonAlphanumeric(e.target.checked)}
          />
          <span>
            {
              textCleanText.char_remove_non_alphanumeric_characters
            }
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="char_remove_all_emails"
            checked={removeEmails}
            onChange={(e) => setRemoveEmails(e.target.checked)}
          />
          <span>{textCleanText.char_remove_all_emails}</span>
        </label>
      </div>

      {/* HTML设置部分 */}
      <div className="flex justify-center items-center space-x-3 border-t border-gray-200 px-2 py-2"></div>
      <h2 className="text-2xl mb-4">
        {textCleanText.html_setting}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_unexcape_html_tags"
            checked={unexcapeHtml}
            onChange={(e) => setUnexcapeHtml(e.target.checked)}
          />
          <span>{textCleanText.html_unexcape_html_tags}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_remove_all_html_tags"
            checked={removeHtmlTags}
            onChange={(e) => setRemoveHtmlTags(e.target.checked)}
          />
          <span>{textCleanText.html_remove_all_html_tags}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_remove_all_ids"
            checked={removeHtmlIds}
            onChange={(e) => setRemoveHtmlIds(e.target.checked)}
          />
          <span>{textCleanText.html_remove_all_ids}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_remove_all_classes"
            checked={removeHtmlClasses}
            onChange={(e) => setRemoveHtmlClasses(e.target.checked)}
          />
          <span>{textCleanText.html_remove_all_classes}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_decode_html_character_entities"
            checked={decodeHtmlEntities}
            onChange={(e) => setDecodeHtmlEntities(e.target.checked)}
          />
          <span>
            {textCleanText.html_decode_html_character_entities}
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="html_decode_url_encoded_characters"
            checked={decodeUrlChars}
            onChange={(e) => setDecodeUrlChars(e.target.checked)}
          />
          <span>
            {textCleanText.html_decode_url_encoded_characters}
          </span>
        </label>
      </div>

      {/* 行设置部分 */}
      <div className="flex justify-center items-center space-x-3 border-t border-gray-200 px-2 py-2"></div>
      <h2 className="text-2xl mb-4">
        {textCleanText.multiple_line_setting}
      </h2>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.line_add}</span>
        <input
          type="text"
          name="add_line_to_left"
          value={addLineToLeft}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-32"
        />
        <span>{textCleanText.line_to_left}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.line_add}</span>
        <input
          type="text"
          name="add_line_to_right"
          value={addLineToRight}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-32"
        />
        <span>{textCleanText.line_to_right}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.line_remove}</span>
        <input
          type="number"
          name="remove_line_from_left"
          value={removeLineFromLeft}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-20"
          min="0"
          step="1"
          inputMode="numeric"
          pattern="\d*"
        />
        <span>{textCleanText.line_from_left}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.line_remove}</span>
        <input
          type="number"
          name="remove_line_from_right"
          value={removeLineFromRight}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-20"
          min="0"
          step="1"
          inputMode="numeric"
          pattern="\d*"
        />
        <span>{textCleanText.line_from_right}</span>
      </div>

      {/* 查找替换部分 */}
      <div className="flex justify-center items-center space-x-3 border-t border-gray-200 px-2 py-2"></div>
      <h2 className="text-2xl mb-4">
        {textCleanText.find_replace_setting}
      </h2>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.find_find}</span>
        <input
          type="text"
          name="find_and_replace_find"
          value={findText}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-32"
        />
        <span>{textCleanText.find_replace_text}</span>
        <input
          type="text"
          name="find_and_replace_replace"
          value={replaceText}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-32"
        />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.find_replace}</span>
        <input
          type="number"
          name="replace_tab_character"
          value={spaceCount}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-12"
          min="1"
          max="8"
          step="1"
          inputMode="numeric"
          pattern="\d*"
        />
        <span>{textCleanText.find_replace_with_tab}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span>{textCleanText.find_replace_with_space}</span>
        <input
          type="number"
          name="replace_tab_tab"
          value={tabCount}
          onChange={handleInputChange}
          className="border-b-2 border-gray-300 bg-transparent py-1 px-2 focus:outline-none focus:border-blue-500 w-12"
          min="1"
          max="8"
          step="1"
          inputMode="numeric"
          pattern="\d*"
        />
        <span>{textCleanText.find_replace_space}</span>
      </div>

      <button
        type="button"
        className="mt-4 p-2 bg-green-500 text-white rounded m-2"
        onClick={selectAll}
      >
        {textCleanText.select_all}
      </button>
      <button
        type="button"
        className="mt-4 p-2 bg-red-500 text-white rounded m-2"
        onClick={selectNone}
      >
        {textCleanText.select_none}
      </button>
      <button
        type="button"
        className="mt-4 p-2 bg-blue-500 text-white rounded m-2"
        onClick={applySettings}
      >
        {textCleanText.text_clean_apply}
      </button>
    </div>
  );
});

// 添加displayName以解决ESLint错误
TextFormatControls.displayName = 'TextFormatControls';

// 将说明文档内容延迟加载
const HelpSection = memo<HelpSectionProps>(({ textCleanText }) => {
  return (
    <div className="w-[95%] mx-auto h-full my-8 text-white w-full max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4">{textCleanText.h2_1}</h2>
      <p className="text-[#7c8aaa]">{textCleanText.h2_1_p}</p>

      <h2 className="text-2xl mb-4">{textCleanText.h2_2}</h2>
      <p className="text-[#7c8aaa]">{textCleanText.h2_2_p}</p>
      <ol className="list-decimal pl-5">
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_2_h3_1}</h3>
          <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_1_p}</p>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_2_h3_2}</h3>
          <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_2_p}</p>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_2_h3_2_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_2_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_2_h3_2_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_2_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_2_h3_2_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_2_h4_3_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_2_h3_2_h4_4}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_2_h4_4_p}</p>
            </li>
          </ol>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_2_h3_3}</h3>
          <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_3_p}</p>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_2_h3_4}</h3>
          <p className="text-[#7c8aaa]">{textCleanText.h2_2_h3_4_p}</p>
        </li>
      </ol>

      <h2 className="text-2xl mb-4">{textCleanText.h2_3}</h2>
      <p className="text-[#7c8aaa]">{textCleanText.h2_3_p_1}</p>
      <ol className="list-decimal pl-5">
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_3_h3_1}</h3>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_1_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_1_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_1_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_1_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_1_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_1_h4_3_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_1_h4_4}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_1_h4_4_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_1_h4_5}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_1_h4_5_p}</p>
            </li>
          </ol>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_3_h3_2}</h3>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_3_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_4}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_4_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_5}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_5_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_2_h4_6}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_2_h4_6_p}</p>
            </li>
          </ol>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_3_h3_3}</h3>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_3_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_3_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_3_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_3_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_3_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_3_h4_3_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_3_h4_4}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_3_h4_4_p}</p>
            </li>
          </ol>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_3_h3_4}</h3>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_4_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_4_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_4_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_4_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_4_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_4_h4_3_p}</p>
            </li>
          </ol>
        </li>
        <li>
          <h3 className="text-xl mb-2">{textCleanText.h2_3_h3_5}</h3>
          <ol className="list-disc pl-5">
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_1}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_1_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_2}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_2_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_3}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_3_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_4}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_4_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_5}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_5_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_6}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_6_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_7}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_7_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_8}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_8_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_9}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_9_p}</p>
            </li>
            <li>
              <h4 className="text-lg mb-1">{textCleanText.h2_3_h3_5_h4_10}</h4>
              <p className="text-[#7c8aaa]">{textCleanText.h2_3_h3_5_h4_10_p}</p>
            </li>
          </ol>
        </li>
      </ol>
      <p className="text-[#7c8aaa]">{textCleanText.h2_3_p_2}</p>
    </div>
  );
});

// 添加displayName以解决ESLint错误
HelpSection.displayName = 'HelpSection';

const PageComponent = ({
  locale = "",
  indexLanguageText,
  textCleanText,
}: PageComponentProps) => {
  // Character Settings
  const [textStr, setTextStr] = useState("");

  // Character Settings
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [stripEmojis, setStripEmojis] = useState(false);
  const [removeNonASCII, setRemoveNonASCII] = useState(false);
  const [removeNonAlphanumeric, setRemoveNonAlphanumeric] = useState(false);
  const [removeEmails, setRemoveEmails] = useState(false);

  // HTML Settings
  const [unexcapeHtml, setUnexcapeHtml] = useState(false);
  const [removeHtmlTags, setRemoveHtmlTags] = useState(false);
  const [removeHtmlIds, setRemoveHtmlIds] = useState(false);
  const [removeHtmlClasses, setRemoveHtmlClasses] = useState(false);
  const [decodeHtmlEntities, setDecodeHtmlEntities] = useState(false);
  const [decodeUrlChars, setDecodeUrlChars] = useState(false);

  // Line settings
  const [addLineToLeft, setAddLineToLeft] = useState("");
  const [addLineToRight, setAddLineToRight] = useState("");
  const [removeLineFromLeft, setRemoveLineFromLeft] = useState(0);
  const [removeLineFromRight, setRemoveLineFromRight] = useState(0);

  // Find and replace settings
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [spaceCount, setSpaceCount] = useState(0);
  const [tabCount, setTabCount] = useState(0);
  
  const htmlEntities = {
    '&quot;': '"', '&apos;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': '\u00A0', '&iexcl;': '¡',
    '&cent;': '¢', '&pound;': '£', '&curren;': '¤', '&yen;': '¥', '&brvbar;': '¦', '&sect;': '§', '&uml;': '¨', '&copy;': '©',
    '&ordf;': 'ª', '&laquo;': '«', '&not;': '¬', '&shy;': '\u00AD', '&reg;': '®', '&macr;': '¯', '&deg;': '°', '&plusmn;': '±',
    '&sup2;': '²', '&sup3;': '³', '&acute;': '´', '&micro;': 'µ', '&para;': '¶', '&middot;': '·', '&cedil;': '¸', '&sup1;': '¹',
    '&ordm;': 'º', '&raquo;': '»', '&frac14;': '¼', '&frac12;': '½', '&frac34;': '¾', '&iquest;': '¿', '&times;': '×', '&divide;': '÷',
    '&Alpha;': 'Α', '&Beta;': 'Β', '&Gamma;': 'Γ', '&Delta;': 'Δ', '&Epsilon;': 'Ε', '&Zeta;': 'Ζ', '&Eta;': 'Η', '&Theta;': 'Θ',
    '&Iota;': 'Ι', '&Kappa;': 'Κ', '&Lambda;': 'Λ', '&Mu;': 'Μ', '&Nu;': 'Ν', '&Xi;': 'Ξ', '&Omicron;': 'Ο', '&Pi;': 'Π', '&Rho;': 'Ρ',
    '&Sigma;': 'Σ', '&Tau;': 'Τ', '&Upsilon;': 'Υ', '&Phi;': 'Φ', '&Chi;': 'Χ', '&Psi;': 'Ψ', '&Omega;': 'Ω', '&alpha;': 'α',
    '&beta;': 'β', '&gamma;': 'γ', '&delta;': 'δ', '&epsilon;': 'ε', '&zeta;': 'ζ', '&eta;': 'η', '&theta;': 'θ', '&iota;': 'ι',
    '&kappa;': 'κ', '&lambda;': 'λ', '&mu;': 'μ', '&nu;': 'ν', '&xi;': 'ξ', '&omicron;': 'ο', '&pi;': 'π', '&rho;': 'ρ', '&sigmaf;': 'ς',
    '&sigma;': 'σ', '&tau;': 'τ', '&upsilon;': 'υ', '&phi;': 'φ', '&chi;': 'χ', '&psi;': 'ψ', '&omega;': 'ω', '&thetasym;': 'ϑ',
    '&upsih;': 'ϒ', '&piv;': 'ϖ', '&bull;': '•', '&hellip;': '…', '&prime;': '′', '&Prime;': '″', '&oline;': '‾', '&frasl;': '⁄',
    '&weierp;': '℘', '&image;': 'ℑ', '&real;': 'ℜ', '&trade;': '™', '&alefsym;': 'ℵ', '&larr;': '←', '&uarr;': '↑', '&rarr;': '→',
    '&darr;': '↓', '&harr;': '↔', '&crarr;': '↵', '&lArr;': '⇐', '&uArr;': '⇑', '&rArr;': '⇒', '&dArr;': '⇓', '&hArr;': '⇔',
    '&forall;': '∀', '&part;': '∂', '&exist;': '∃', '&empty;': '∅', '&nabla;': '∇', '&isin;': '∈', '&notin;': '∉', '&ni;': '∋',
    '&prod;': '∏', '&sum;': '∑', '&minus;': '−', '&lowast;': '∗', '&radic;': '√', '&prop;': '∝', '&infin;': '∞', '&ang;': '∠',
    '&and;': '∧', '&or;': '∨', '&cap;': '∩', '&cup;': '∪', '&int;': '∫', '&there4;': '∴', '&sim;': '∼', '&cong;': '≅', '&asymp;': '≈',
    '&ne;': '≠', '&equiv;': '≡', '&le;': '≤', '&ge;': '≥', '&sub;': '⊂', '&sup;': '⊃', '&nsub;': '⊄', '&sube;': '⊆', '&supe;': '⊇',
    '&oplus;': '⊕', '&otimes;': '⊗', '&perp;': '⊥', '&sdot;': '⋅', '&lceil;': '⌈', '&rceil;': '⌉', '&lfloor;': '⌊', '&rfloor;': '⌋',
    '&lang;': '〈', '&rang;': '〉', '&loz;': '◊', '&spades;': '♠', '&clubs;': '♣', '&hearts;': '♥', '&diams;': '♦',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    console.log("handleInputChange" + name);
    switch (name) {
      case "find_and_replace_find":
        setFindText(value);
        break;
      case "find_and_replace_replace":
        setReplaceText(value);
        break;
      case "replace_tab_character":
        setSpaceCount(parseInt(value, 10) || 0);
        break;
      case "replace_tab_tab":
        setTabCount(parseInt(value, 10) || 0);
        break;
      case "add_line_to_left":
        setAddLineToLeft(value);
        break;
      case "add_line_to_right":
        setAddLineToRight(value);
        break;
      case "remove_line_from_left":
        setRemoveLineFromLeft(parseInt(value, 10) || 0);
        break;
      case "remove_line_from_right":
        setRemoveLineFromRight(parseInt(value, 10) || 0);
        break;
      case "char_remove_puctuation_marks":
        setRemovePunctuation(checked);
        break;
      case "char_strip_all_emojis":
        setStripEmojis(checked);
        break;
      case "char_remove_non_ascii_characters":
        setRemoveNonASCII(checked);
        break;
      case "char_remove_non_alphanumeric_characters":
        setRemoveNonAlphanumeric(checked);
        break;
      case "char_remove_all_emails":
        setRemoveEmails(checked);
        break;
      case "html_unexcape_html_tags":
        setUnexcapeHtml(checked);
        break;
      case "html_remove_all_html_tags":
        setRemoveHtmlTags(checked);
        break;
      case "html_remove_all_ids":
        setRemoveHtmlIds(checked);
        break;
      case "html_remove_all_classes":
        setRemoveHtmlClasses(checked);
        break;
      case "html_decode_html_character_entities":
        setDecodeHtmlEntities(checked);
        break;
      case "html_decode_url_encoded_characters":
        setDecodeUrlChars(checked);
        break;
      default:
        break;
    }
  };

  const applySettings = () => {
    let modifiedText = textStr;

    // Apply Character Settings
    if (removePunctuation) {
      modifiedText = modifiedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }
    if (stripEmojis) {
      modifiedText = modifiedText.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\uFE00-\uFE0F]/g, "");
    }
    if (removeNonASCII) {
      modifiedText = modifiedText.replace(/[^\x00-\x7F]/g, "");
    }
    if (removeNonAlphanumeric) {
      modifiedText = modifiedText.replace(/[^a-zA-Z0-9]/g, "");
    }
    if (removeEmails) {
      modifiedText = modifiedText.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,"");
    }

    // Apply HTML Settings
    if (unexcapeHtml) {
      Object.keys(htmlEntities).forEach((key) => {
        const value = htmlEntities[key];
        modifiedText = modifiedText.replace(new RegExp(key, 'g'), value);
      });
    }
    if (removeHtmlTags) {
      modifiedText = modifiedText.replace(/<\/?[^>]+(>|$)/g, "");
    }
    if (removeHtmlIds) {
      modifiedText = modifiedText.replace(/id="[^"]*"/g, "");
    }
    if (removeHtmlClasses) {
      modifiedText = modifiedText.replace(/class="[^"]*"/g, "");
    }
    if (decodeHtmlEntities) {
      const entityPattern = new RegExp(`(${Object.keys(htmlEntities).join('|')})`, 'g');
      modifiedText = modifiedText.replace(entityPattern, (match) => {
        return htmlEntities[match] || match;
      });
    }
    if (decodeUrlChars) {
      modifiedText = decodeURIComponent(modifiedText);
    }

    // Find and Replace Settings
    if (findText && replaceText) {
      const regex = new RegExp(findText, 'g');
      modifiedText = modifiedText.replace(regex, replaceText);
    }
    if (spaceCount > 0) {
      const spacePattern = ' '.repeat(spaceCount);
      modifiedText = modifiedText.replace(new RegExp(spacePattern, 'g'), '\t');
    }
    if (tabCount > 0) {
      const tabPattern = '\t';
      modifiedText = modifiedText.replace(new RegExp(tabPattern, 'g'), ' '.repeat(tabCount));
    }

    // Line Settings
    modifiedText = modifiedText.split("\n").map((line) => {
      if (addLineToLeft) {
        line = addLineToLeft + line;
      }
      if (addLineToRight) {
        line = line + addLineToRight;
      }
      if (removeLineFromLeft > 0) {
        line = line.substring(Math.min(line.length, removeLineFromLeft));
      }
      if (removeLineFromRight > 0) {
        line = line.substring(0, Math.max(0, line.length - removeLineFromRight));
      }
      return line;
    }).join("\n");

    setTextStr(modifiedText);
  };

  const selectAll = () => {
    setRemovePunctuation(true);
    setStripEmojis(true);
    setRemoveNonASCII(true);
    setRemoveNonAlphanumeric(true);
    setRemoveEmails(true);
    setUnexcapeHtml(true);
    setRemoveHtmlTags(true);
    setRemoveHtmlIds(true);
    setRemoveHtmlClasses(true);
    setDecodeHtmlEntities(true);
    setDecodeUrlChars(true);
  };

  const selectNone = () => {
    setRemovePunctuation(false);
    setStripEmojis(false);
    setRemoveNonASCII(false);
    setRemoveNonAlphanumeric(false);
    setRemoveEmails(false);
    setUnexcapeHtml(false);
    setRemoveHtmlTags(false);
    setRemoveHtmlIds(false);
    setRemoveHtmlClasses(false);
    setDecodeHtmlEntities(false);
    setDecodeUrlChars(false);

    setAddLineToLeft("");
    setAddLineToRight("");
    setRemoveLineFromLeft(0);
    setRemoveLineFromRight(0);
    setFindText("");
    setReplaceText("");
    setSpaceCount(0);
    setTabCount(0);
  };

  const removeExtraSpaces = () => {
    setTextStr(textStr.replace(/\s+/g, " ").trim());
  };

  const removeEmptyLines = () => {
    setTextStr(textStr.replace(/^\s*$(?:\r\n?|\n)/gm, ""));
  };

  const removeLineBreaks = () => {
    setTextStr(textStr.replace(/\n/g, " "));
  };

  const uppercaseAll = () => {
    setTextStr(textStr.toUpperCase());
  };

  const lowercaseAll = () => {
    setTextStr(textStr.toLowerCase());
  };

  const capitalizeSentences = () => {
    setTextStr(
      textStr
        .toLowerCase()
        .replace(/(^\w{1}|\.\s*\w{1})/gi, (c) => c.toUpperCase())
    );
  };

  const capitalizeWords = () => {
    setTextStr(textStr.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));
  };

  const removeDuplicateLines = () => {
    const uniqueLines = new Set(textStr.split(/\r?\n/));
    setTextStr(Array.from(uniqueLines).join("\n"));
  };

  const copyText = () => {
    navigator.clipboard.writeText(textStr).then(
      () => {
        confettiOriginal({ particleCount: 300, spread: 200, origin: { y: 0.6 } });
      },
      (err) => {
        alert("Failed to copy text: " + err);
      }
    );
  };

  const clearText = () => {
    setTextStr("");
  };

  const buttons = [
    { name: textCleanText.common_remove_extra_sapces, action: removeExtraSpaces },
    { name: textCleanText.common_remove_empty_lines, action: removeEmptyLines },
    { name: textCleanText.common_remove_line_breaks, action: removeLineBreaks },
    { name: textCleanText.common_uppercase_all, action: uppercaseAll },
    { name: textCleanText.common_lowercase_all, action: lowercaseAll },
    { name: textCleanText.common_capitalize_sentences, action: capitalizeSentences },
    { name: textCleanText.common_capitalize_words, action: capitalizeWords },
    { name: textCleanText.common_remove_duplicate_lines, action: removeDuplicateLines },
    { name: textCleanText.common_copy, action: copyText },
    { name: textCleanText.common_clear, action: clearText },
  ];

  return (
    <>
      <HeadInfo
        title={indexLanguageText.title}
        description={indexLanguageText.description}
        keywords={indexLanguageText.keywords}
        locale={locale}
        page={""}
      />
      <Header
        locale={locale}
        indexLanguageText={indexLanguageText}
      />
      <div className="p-4 space-y-4">
        <div className="block overflow-hidden bg-[#020d24] bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-1">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                {textCleanText.h1}
              </h1>
              <p className="text-[#7c8aaa] text-lg text-left">
                {textCleanText.h1_desc}
              </p>
            </div>
            <div>
              <div
                className={
                  "w-[90%] mx-auto rounded-tl-[30px] rounded-tr-[30px] border-[12px] border-[#ffffff1f]"
                }
              >
                <form className="relative shadow-lg">
                  <div className="overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 rounded-tl-[20px] rounded-tr-[20px]">
                    <textarea
                      rows={10}
                      name="contentText"
                      id="contentText"
                      className="block w-full resize-none border border-[#7c8aaa] text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg pt-4 pl-4"
                      placeholder={textCleanText.default_text}
                      value={textStr}
                      onChange={(e) => setTextStr(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-2 py-2 bg-white text-black">
                    {buttons.map((button, index) => (
                      <button
                        key={index}
                        type="button"
                        className="cursor-pointer p-2 rounded-lg border border-gray-200 text-sm"
                        onClick={button.action}
                      >
                        {button.name}
                      </button>
                    ))}
                  </div>

                  <TextFormatControls
                    textCleanText={textCleanText}
                    removePunctuation={removePunctuation}
                    setRemovePunctuation={setRemovePunctuation}
                    stripEmojis={stripEmojis}
                    setStripEmojis={setStripEmojis}
                    removeNonASCII={removeNonASCII}
                    setRemoveNonASCII={setRemoveNonASCII}
                    removeNonAlphanumeric={removeNonAlphanumeric}
                    setRemoveNonAlphanumeric={setRemoveNonAlphanumeric}
                    removeEmails={removeEmails}
                    setRemoveEmails={setRemoveEmails}
                    unexcapeHtml={unexcapeHtml}
                    setUnexcapeHtml={setUnexcapeHtml}
                    removeHtmlTags={removeHtmlTags}
                    setRemoveHtmlTags={setRemoveHtmlTags}
                    removeHtmlIds={removeHtmlIds}
                    setRemoveHtmlIds={setRemoveHtmlIds}
                    removeHtmlClasses={removeHtmlClasses}
                    setRemoveHtmlClasses={setRemoveHtmlClasses}
                    decodeHtmlEntities={decodeHtmlEntities}
                    setDecodeHtmlEntities={setDecodeHtmlEntities}
                    decodeUrlChars={decodeUrlChars}
                    setDecodeUrlChars={setDecodeUrlChars}
                    addLineToLeft={addLineToLeft}
                    setAddLineToLeft={setAddLineToLeft}
                    addLineToRight={addLineToRight}
                    setAddLineToRight={setAddLineToRight}
                    removeLineFromLeft={removeLineFromLeft}
                    setRemoveLineFromLeft={setRemoveLineFromLeft}
                    removeLineFromRight={removeLineFromRight}
                    setRemoveLineFromRight={setRemoveLineFromRight}
                    findText={findText}
                    setFindText={setFindText}
                    replaceText={replaceText}
                    setReplaceText={setReplaceText}
                    spaceCount={spaceCount}
                    setSpaceCount={setSpaceCount}
                    tabCount={tabCount}
                    setTabCount={setTabCount}
                    handleInputChange={handleInputChange}
                    selectAll={selectAll}
                    selectNone={selectNone}
                    applySettings={applySettings}
                  />
                </form>
              </div>
            </div>

            {/* 始终显示帮助部分，不做延迟加载 */}
            <HelpSection textCleanText={textCleanText} />
          </div>
        </div>
      </div>
      <Footer locale={locale} description={indexLanguageText.description} />
    </>
  );
};

export default PageComponent;
